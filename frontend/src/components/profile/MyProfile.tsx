import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MailOutlined } from "@ant-design/icons";
import { styled } from "styled-components";
import { Profile } from "../../common";
import iconProfile from "../layout/icon-profile.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileBig = styled(Profile)`
  width: 80px;
  height: 80px;
  margin-bottom: 30px;
  margin-top: 20px;
`;

const MyProfile = () => {
  const profileData = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <ProfileBig src={profileData.profileUrl || iconProfile} alt={"profile"} />
      <h2>{profileData?.name}</h2>
      <p>
        <MailOutlined /> {profileData?.email}
      </p>
    </Container>
  );
};

export default MyProfile;
