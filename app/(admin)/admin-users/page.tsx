import Heading from "@/components/Heading";
import { getUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import UsersTable from "@/components/UsersTable";

interface AdminUserPageProps {}

const AdminUserPage = async ({}: AdminUserPageProps) => {
  const _ = await currentUser();
  const userId: string = _?.id || "";
  const users = await getUsers(userId);

  return (
    <main className="my-10">
      <Heading>Users</Heading>
      <UsersTable users={users} />
    </main>
  );
};

export default AdminUserPage;
