import { Button, Popover } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { RootState } from "../../redux/store";
import Logout from "../auth/logout";
import defaultProfile from "./profile-default.svg";

const Container = styled.div`
  max-width: 100%;
  top: 0;
  position: sticky;
  background-color: aliceblue;
  padding: 10px 40px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
  cursor: pointer;
`;

const Toolbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const authState = useSelector((state: RootState) => state.auth);
  const { name, profileUrl, isAuthenticated } = authState;

  const onClickLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <Container>
      <div onClick={() => navigate("/")}>Home, sweet home</div>
      <div onClick={() => navigate("/learn")}>Learn</div>
      <h4>{isAuthenticated ? `Hello, ${name}` : ""}</h4>
      <Popover
        placement="bottomRight"
        open={menuOpen}
        content={
          isAuthenticated ? (
            <Logout />
          ) : (
            <Button onClick={onClickLogin}>Log in</Button>
          )
        }
        onOpenChange={setMenuOpen}
        trigger="click"
      >
        <Profile src={profileUrl || defaultProfile} alt={"profile"} />
      </Popover>
    </Container>
  );
};

export default Toolbar;
