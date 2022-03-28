import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ${reset};

  body{
    font-family: 'Do Hyeon', sans-serif;
    color:${(props) => props.theme.white.darker};
    background-color: black;
  }
  a{
    text-decoration:none;
    color:inherit;
  }
`;

export default GlobalStyle;
