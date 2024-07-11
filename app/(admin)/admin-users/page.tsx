import Heading from "@/components/Heading";
import { getUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/database/models/User.model"; // Adjust the path as per your project structure
import UsersTable from "@/components/UsersTable";

interface AdminUserPageProps {}

const AdminUserPage = async ({}: AdminUserPageProps) => {
	const _ = await currentUser();
	const userId: string = _?.id || "";
	const users: User[] = await getUsers(userId); // Assuming getUsers returns an array of User objects

	return (
		<main className="my-10">
			<Heading>Users</Heading>
			<UsersTable users={users} />
		</main>
	);
};

export default AdminUserPage;
