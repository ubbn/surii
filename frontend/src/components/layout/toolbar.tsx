import { Button, Popover } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { BASE_COLOR, FlexRow } from "../../common";
import { RootState } from "../../redux/store";
import Logout from "../auth/logout";
import iconProfile from "./icon-profile.svg";
import Menu from "./menu";
import Tooltip from "../../common/tooltip";

const Container = styled.div`
  max-width: 100%;
  top: 0;
  position: sticky;
  background-color: ${BASE_COLOR};
  padding: 6px 30px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border: 1px solid white;
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
      <Menu />
      <FlexRow>
        <Tooltip text={name ? `Hello, ${name}` : ""}>
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
            <Profile src={profileUrl || iconProfile} alt={"profile"} />
          </Popover>
        </Tooltip>
      </FlexRow>
    </Container>
  );
};

export default Toolbar;
