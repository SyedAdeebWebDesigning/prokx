import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div>
      <div className="absolute left-0 top-0 w-full">
        <Header />
      </div>
      <UserProfile path="/user-profile" />
    </div>
  );
};

export default UserProfilePage;
