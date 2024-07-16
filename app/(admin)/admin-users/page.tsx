import Heading from "@/components/Heading";
import { getUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import UsersTable from "@/components/UsersTable";

interface AdminUserPageProps {}

const AdminUserPage = async ({}: AdminUserPageProps) => {
  const _ = await currentUser();
  const userId: string = _?.id || "";
  const users = await getUsers(userId);

  if (users.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Current there are no users available
      </div>
    );
  }
  return (
    <main className="my-10">
      <Heading>Users</Heading>
      <UsersTable users={users} />
    </main>
  );
};

export default AdminUserPage;
