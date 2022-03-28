import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll, Variants } from "framer-motion";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router";
import { handleGetNowPlayingMovies, handleGetPopularMovies, handleGetTopRatedMovies, handleGetUpcomingMovies } from "../api";
import { Movie, MovieData } from "../interfaces/movie.interface";

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

const Wrapper = styled.div`
  background: black;
  overflow: hidden;
`;

const Loader = styled.div`
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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => `https://image.tmdb.org/t/p/original${props.backdroppath}`});
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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => `https://image.tmdb.org/t/p/original${props.backdroppath}`});
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
  top: ${(props) => props.scrolly + 300}px;
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

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const moviePathMatch: PathMatch<"type" | "id"> | null = useMatch("/movies/:type/:id");
  const [moving, setMoving] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [movieData, setMovieData] = useState<Movie | undefined>(undefined);
  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<MovieData>(["movie", "nowPlaying"], handleGetNowPlayingMovies);
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<MovieData>(["movie", "topRated"], handleGetTopRatedMovies);
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery<MovieData>(["movie", "upcoming"], handleGetUpcomingMovies);
  const { data: popularData, isLoading: popularLoading } = useQuery<MovieData>(["movie", "popular"], handleGetPopularMovies);

  const handleIncreasePage = (): void => {
    if (moving === true) {
      return;
    }
    if (nowPlayingData) {
      setMoving(true);
      const totalMovies: number = nowPlayingData.results.length;
      const eachMovies: number = 5;
      const totalPages: number = Math.ceil(totalMovies / eachMovies);

      if (page === totalPages - 1) {
        setPage(0);
      }
      setPage((page) => page + 1);
    }
  };

  const handleSetMoving = (): void => {
    setMoving(false);
  };

  const onBoxClicked = (type: string, movieId: number): void => {
    navigate(`/movies/${type}/${movieId}`);
  };

  const onOverlayClicked = (): void => {
    navigate("/");
  };

  useEffect(() => {
    let result: Movie | undefined;

    if (moviePathMatch?.params.type === "now-playing") {
      result = nowPlayingData?.results.find((movie: Movie) => String(movie.id) === moviePathMatch?.params.id);
    } else if (moviePathMatch?.params.type === "top-rated") {
      result = topRatedData?.results.find((movie: Movie) => String(movie.id) === moviePathMatch?.params.id);
    } else if (moviePathMatch?.params.type === "upcoming") {
      result = upcomingData?.results.find((movie: Movie) => String(movie.id) === moviePathMatch?.params.id);
    } else if (moviePathMatch?.params.type === "popular") {
      result = popularData?.results.find((movie: Movie) => String(movie.id) === moviePathMatch?.params.id);
    }

    setMovieData(result);
  }, [moviePathMatch, nowPlayingData?.results, topRatedData?.results, upcomingData?.results, popularData?.results]);

  return (
    <Wrapper>
      {nowPlayingLoading === true || topRatedLoading === true || popularLoading === true || upcomingLoading === true ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner onClick={handleIncreasePage} backdroppath={nowPlayingData?.results[0].backdrop_path || ""}>
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <Slider>
              <h1>상영중인 영화</h1>
              <AnimatePresence initial={false} onExitComplete={handleSetMoving}>
                <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                  {nowPlayingData?.results.slice(5 * page, 5 * (page + 1)).map((movie: Movie) => (
                    <Box
                      layoutId={`now-playing/${movie.id}`}
                      onClick={() => onBoxClicked("now-playing", movie.id)}
                      key={movie.id}
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

            <Slider>
              <h1>평점높은 영화</h1>
              <AnimatePresence initial={false} onExitComplete={handleSetMoving}>
                <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                  {topRatedData?.results.slice(5 * page, 5 * (page + 1)).map((movie: Movie) => (
                    <Box
                      layoutId={`top-rated/${movie.id}`}
                      onClick={() => onBoxClicked("top-rated", movie.id)}
                      key={movie.id}
                      backdroppath={movie.backdrop_path || movie.poster_path}
                      variants={boxVariants}
                      initial="start"
                      animate="end"
                      whileHover="whileHover"
                      transition={boxVariants.transition}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title || movie.original_title}</h4>
                      </Info>
                    </Box>
                  ))}
                </Row>
              </AnimatePresence>
            </Slider>

            <Slider>
              <h1>개봉 예정 영화</h1>
              <AnimatePresence initial={false} onExitComplete={handleSetMoving}>
                <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                  {upcomingData?.results.slice(5 * page, 5 * (page + 1)).map((movie: Movie) => (
                    <Box
                      layoutId={`upcoming/${movie.id}`}
                      onClick={() => onBoxClicked("upcoming", movie.id)}
                      key={movie.id}
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

            <Slider>
              <h1>인기 영화</h1>
              <AnimatePresence initial={false} onExitComplete={handleSetMoving}>
                <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                  {popularData?.results.slice(5 * page, 5 * (page + 1)).map((movie: Movie) => (
                    <Box
                      layoutId={`popular/${movie.id}`}
                      onClick={() => onBoxClicked("popular", movie.id)}
                      key={movie.id}
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
          </SliderContainer>

          <AnimatePresence>
            {moviePathMatch && (
              <>
                <Overlay onClick={onOverlayClicked} variants={overlayVariants} animate="end" exit="exit"></Overlay>
                <Modal layoutId={`${moviePathMatch.params.type}/${moviePathMatch.params.id}`} scrolly={scrollY.get()}>
                  {movieData && (
                    <ModalContent>
                      <img src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path || movieData.poster_path}`} alt={movieData.title} />
                      <div>
                        <h1>
                          {movieData.title} ({movieData.release_date.substring(0, 4)})
                        </h1>
                        <span>⭐️ {movieData.vote_average}</span>
                        <p>{movieData.overview.length > 410 ? `${movieData.overview.substring(0, 410)}...` : movieData.overview}</p>
                      </div>
                    </ModalContent>
                  )}
                </Modal>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
