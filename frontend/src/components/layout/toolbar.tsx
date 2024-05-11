import { Button, Popover } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { BASE_COLOR, FlexRow, Profile } from "../../common";
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
  z-index: 999;

  @media (max-width: 600px) {
    padding: 6px 20px;
  }
`;

const ColumnLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
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

  const onClickProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const onClickBlog = () => {
    setMenuOpen(false);
    navigate("/blog");
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
                <ColumnLayout>
                  <Button onClick={onClickProfile}>Profile</Button>
                  <Button onClick={onClickBlog}>Blog</Button>
                  <Logout />
                </ColumnLayout>
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
