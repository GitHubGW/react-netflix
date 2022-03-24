import { useState } from "react";
import { Link, useMatch, PathMatch } from "react-router-dom";
import styled from "styled-components";
import { AnimationControls, motion, ScrollMotionValues, useAnimation, useViewportScroll, Variants } from "framer-motion";

const Container = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 1);
  font-size: 14px;
  padding: 20px 20px;
  color: white;
  box-sizing: border-box;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MotionLogoSvg = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  cursor: pointer;
`;

const MotionLogoPath = styled(motion.path)`
  stroke-width: 6px;
  stroke: white;
`;

const Ul = styled.ul`
  display: flex;
  align-items: center;
`;

const Li = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 5px;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
`;

const MotionSearchSvg = styled(motion.svg)`
  width: 20px;
  cursor: pointer;
`;

const MotionSearchPath = styled(motion.path)``;

const MotionSearchInput = styled(motion.input)`
  padding: 10px 10px;
  padding-left: 40px;
  width: 250px;
  box-sizing: border-box;
  border-radius: 5px;
  border: none;
  outline: none;
  margin-right: 5px;
  transform-origin: right center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
`;

const Header = () => {
  const homePathMatch: PathMatch<string> | null = useMatch("/");
  const tvPathMatch: PathMatch<string> | null = useMatch("/tv");
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const inputAnimationControls: AnimationControls = useAnimation();
  const containerAnimationControls: AnimationControls = useAnimation();
  const { scrollYProgress }: ScrollMotionValues = useViewportScroll();
  const logoSvgVariants: Variants = {
    start: { fillOpacity: 0 },
    end: { fillOpacity: 1, transition: { duration: 0.5 } },
    whileHover: { fillOpacity: [1, 0, 1, 0, 1], transition: { duration: 1, repeat: Infinity } },
  };
  const searchSvgVariants: Variants = {
    start: { x: 0 },
    end: { x: isOpenSearch === true ? -250 : 0, transition: { duration: 0.5, type: "keyframes" } },
  };
  const searchInputVariants: Variants = {
    start: { scaleX: 0 },
  };

  scrollYProgress.onChange(() => {
    if (scrollYProgress.get() > 0.1) {
      containerAnimationControls.start({ backgroundColor: "rgba(0,0,0,0)" });
    } else {
      containerAnimationControls.start({ backgroundColor: "rgba(0,0,0,1)" });
    }
  });

  const handleToggleSearchBar = (): void => {
    if (isOpenSearch === true) {
      inputAnimationControls.start({ scaleX: 0, type: "keyframes", transition: { duration: 0.5 } });
    } else if (isOpenSearch === false) {
      inputAnimationControls.start({ scaleX: 1, type: "keyframes", transition: { duration: 0.5 } });
    }
    setIsOpenSearch((isOpenSearch: boolean) => !isOpenSearch);
  };
  return (
    <Container animate={containerAnimationControls}>
      <NavContainer>
        <Link to="/">
          <MotionLogoSvg variants={logoSvgVariants} initial="start" animate="end" whileHover="whileHover" viewBox="0 0 1024 276.742">
            <MotionLogoPath
              fill="#d81f26"
              d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
            />
          </MotionLogoSvg>
        </Link>
        <Ul>
          <Li>
            <Link to="/">Home {homePathMatch && <Circle layoutId="circle" />}</Link>
          </Li>
          <Li>
            <Link to="/tv">TV {tvPathMatch && <Circle layoutId="circle" />}</Link>
          </Li>
        </Ul>
      </NavContainer>
      <SearchContainer>
        <MotionSearchInput variants={searchInputVariants} initial="start" animate={inputAnimationControls} type="text" placeholder="영화, TV 등을 검색해보세요." />
        <SearchButton type="button">
          <MotionSearchSvg onClick={handleToggleSearchBar} variants={searchSvgVariants} initial="start" animate="end" viewBox="0 0 512 512">
            <MotionSearchPath
              fill="darkgray"
              d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </MotionSearchSvg>
        </SearchButton>
      </SearchContainer>
    </Container>
  );
};

export default Header;
