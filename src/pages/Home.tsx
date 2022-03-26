import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { handleGetNowPlayingMovies } from "../api";
import { Movie, MovieData } from "../interfaces/movie.interface";

const rowVariants: Variants = {
  start: { x: window.innerWidth },
  end: { x: 0, transition: { duration: 1, type: "tween" } },
  exit: { x: -window.innerWidth, transition: { duration: 1, type: "tween" } },
};

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ backdropPath: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => `https://image.tmdb.org/t/p/original${props.backdropPath}`});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h1`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -300px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 200px;
  grid-auto-rows: 200px;
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ backdropPath: string }>`
  cursor: pointer;
  background-color: white;
  color: red;
  font-size: 66px;
  border-radius: 5px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => `https://image.tmdb.org/t/p/original${props.backdropPath}`});
  background-size: cover;
  background-position: center center;
`;

const Home = () => {
  const [moving, setMoving] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const { data, isLoading } = useQuery<MovieData>(["movie", "nowPlaying"], handleGetNowPlayingMovies);

  const handleIncreasePage = (): void => {
    if (moving === true) {
      return;
    }
    if (data) {
      setMoving(true);
      const totalMovies: number = data.results.length;
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

  return (
    <Wrapper>
      {isLoading === true ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner onClick={handleIncreasePage} backdropPath={data?.results[0].backdrop_path || ""}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={handleSetMoving}>
              <Row key={page} variants={rowVariants} initial="start" animate="end" exit="exit">
                {data?.results.slice(5 * page, 5 * (page + 1)).map((movie: Movie) => (
                  <Box key={movie.id} backdropPath={movie.backdrop_path}></Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
