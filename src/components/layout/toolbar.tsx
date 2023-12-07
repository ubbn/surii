import { useSelector } from "react-redux";
import { Popover, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { RootState } from "../../redux/store";
import defaultProfile from "./profile-default.svg";
import Logout from "../auth/logout";
import { useState } from "react";

const Container = styled.div`
  max-width: 100%;
  top: 0;
  position: sticky;
  background-color: aliceblue;
  padding: 0 30px;
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
  const { name, profileUrl, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const onClickLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <Container>
      <h4>Hello, {name}</h4>
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
