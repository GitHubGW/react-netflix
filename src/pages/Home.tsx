import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router";
import { getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies, getPopularMovies } from "../api";
import { Movie, MovieData } from "../types/movie";

const Home = () => {
  const [page, setPage] = useState(0);
  const [moving, setMoving] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const moviePathMatch = useMatch("/movies/:type/:id");
  const [movieData, setMovieData] = useState<Movie | undefined>(undefined);
  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<MovieData>(["movie", "nowPlaying"], getNowPlayingMovies);
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<MovieData>(["movie", "topRated"], getTopRatedMovies);
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery<MovieData>(["movie", "upcoming"], getUpcomingMovies);
  const { data: popularData, isLoading: popularLoading } = useQuery<MovieData>(["movie", "popular"], getPopularMovies);
  const isLoading = nowPlayingLoading || topRatedLoading || popularLoading || upcomingLoading;
  const DATA_SOURCE = useMemo(
    () => [
      { key: "now-playing", data: nowPlayingData },
      { key: "top-rated", data: topRatedData },
      { key: "upcoming", data: upcomingData },
      { key: "popular", data: popularData },
    ],
    [nowPlayingData, topRatedData, upcomingData, popularData]
  );

  const rowVariants: Variants = {
    start: { x: window.innerWidth },
    end: { x: 0, transition: { duration: 2, type: "tween" } },
    exit: { x: -window.innerWidth, transition: { duration: 2, type: "tween" } },
  };

  const boxVariants: Variants = {
    start: { scale: 1 },
    end: { scale: 1, transition: { duration: 0.3, type: "tween" } },
    whileHover: { scale: 1.2, y: -50, transition: { delay: 0.3, duration: 0.3, type: "tween" } },
    transition: { transition: { type: "tween" } },
  };

  const infoVariants: Variants = {
    whileHover: { opacity: 1, transition: { delay: 0.3 } },
  };

  const overlayVariants: Variants = {
    start: { opacity: 0 },
    end: { opacity: 0.8, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const handleIncreasePage = useCallback(() => {
    if (moving || !nowPlayingData) {
      return;
    }
    const nowPlayingMoviesLength = nowPlayingData.results.length;
    const eachMoviesLength = 5;
    const totalPages = Math.ceil(nowPlayingMoviesLength / eachMoviesLength);
    setPage((prev) => {
      return prev === totalPages - 1 ? 0 : prev + 1;
    });
    setMoving(true);
  }, [moving, nowPlayingData]);

  const handleSetMoving = useCallback(() => {
    setMoving(false);
  }, []);

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleGoMovieDetail = useCallback(
    (type: string, movieId: number) => {
      navigate(`/movies/${type}/${movieId}`);
    },
    [navigate]
  );

  useEffect(() => {
    const foundDataSource = DATA_SOURCE.find((dataSource) => moviePathMatch?.params.type === dataSource.key);
    const result = foundDataSource?.data?.results.find((movie) => String(movie.id) === moviePathMatch?.params.id);
    setMovieData(result);
  }, [DATA_SOURCE, moviePathMatch?.params.id, moviePathMatch?.params.type]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Banner onClick={handleIncreasePage} backdroppath={nowPlayingData?.results[0].backdrop_path || ""}>
        <Title>{nowPlayingData?.results[0].title}</Title>
        <Overview>{nowPlayingData?.results[0].overview}</Overview>
      </Banner>
      <SliderContainer>
        {DATA_SOURCE.map((dataSource, index) => (
          <Slider key={`${dataSource.key}${index}`}>
            <h2>{dataSource.key}</h2>
            <AnimatePresence key={`${dataSource.key}${index}`} initial={false} onExitComplete={handleSetMoving}>
              <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                {dataSource.data?.results.slice(5 * page, 5 * (page + 1)).map((movie) => (
                  <Box
                    key={movie.id}
                    layoutId={`${dataSource.key}/${movie.id}`}
                    onClick={() => handleGoMovieDetail(dataSource.key, movie.id)}
                    backdroppath={movie.backdrop_path || movie.poster_path}
                    variants={boxVariants}
                    initial="start"
                    animate="end"
                    whileHover="whileHover"
                    transition={boxVariants.transition}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        ))}
      </SliderContainer>

      {moviePathMatch && (
        <AnimatePresence>
          <Overlay onClick={handleGoHome} variants={overlayVariants} animate="end" exit="exit" />
          <Modal layoutId={`${moviePathMatch.params.type}/${moviePathMatch.params.id}`} scrolly={scrollY.get()}>
            {movieData && (
              <ModalContent>
                <img src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path || movieData.poster_path}`} alt={movieData.title} />
                <div>
                  <h2>
                    {movieData.title} ({movieData.release_date.substring(0, 4)})
                  </h2>
                  <span>⭐️ {movieData.vote_average}</span>
                  <p>{movieData.overview.length > 400 ? `${movieData.overview.substring(0, 400)}...` : movieData.overview}</p>
                </div>
              </ModalContent>
            )}
          </Modal>
        </AnimatePresence>
      )}
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background: black;
  overflow: hidden;
`;

const Loading = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ backdroppath: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${({ backdroppath }) => `https://image.tmdb.org/t/p/original${backdroppath}`});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  line-height: 1.6;
  width: 50%;
`;

const SliderContainer = styled.div`
  display: grid;
  row-gap: 100px;
  grid-template-rows: repeat(4, 200px);
  padding: 40px;
  box-sizing: border-box;
  position: absolute;
  top: 75%;
  width: 100%;
  overflow: hidden;
  padding-bottom: 80px;
`;

const Slider = styled.div`
  position: relative;

  h1 {
    font-size: 22px;
    margin-bottom: 15px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 200px;
  gap: 10px;
  width: 100%;
`;

const Box = styled(motion.div)<{ backdroppath: string }>`
  cursor: pointer;
  background-color: white;
  border-radius: 5px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${({ backdroppath }) => `https://image.tmdb.org/t/p/original${backdroppath}`});
  background-size: cover;
  background-position: center center;

  &:first-child {
    transform-origin: bottom left;
  }
  &:last-child {
    transform-origin: bottom right;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  opacity: 0;
  text-align: center;

  h4 {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const Modal = styled(motion.div)<{ scrolly: number }>`
  position: absolute;
  width: 35vw;
  height: 45vh;
  top: ${({ scrolly }) => scrolly + 300}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  background-color: black;
  overflow: hidden;
`;

const ModalContent = styled.div`
  img {
    width: 100%;
    opacity: 0.8;
  }
  div {
    padding: 20px;
    position: relative;
    top: -55px;
    h1 {
      font-size: 23px;
      margin-bottom: 15px;
    }
    span {
      display: block;
      margin-bottom: 10px;
    }
    p {
      font-size: 17px;
      line-height: 1.5;
    }
  }
`;
