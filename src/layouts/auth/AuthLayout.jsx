import styled from "styled-components";
import bg from '../../assets/images/bg.png'
import {Outlet} from "react-router-dom";

const AuthLayoutDiv = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url(${bg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    display: flex;
    justify-content: center;
    align-items: center;
`
const AuthLayout = () => {
  return(
      <AuthLayoutDiv>
          <Outlet />
      </AuthLayoutDiv>
  )
}
export default AuthLayout
