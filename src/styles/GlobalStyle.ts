import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ${reset};

  a{
    text-decoration:none;
    color:inherit;
  }
`;

export default GlobalStyle;
