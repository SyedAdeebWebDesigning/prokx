import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
	return (
		<div>
			<div className="absolute top-0 w-full left-0">
				<Header />
			</div>
			<UserProfile path="/user-profile" />
		</div>
	);
};

export default UserProfilePage;
