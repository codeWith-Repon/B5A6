import { userColumns } from '@/components/modules/Admin/UserManagement/UserColumn';
import ViewUserDetails from '@/components/modules/Admin/UserManagement/ViewUserDetails';
import ManagementTable from '@/components/shared/ManagementTable';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TablePagination from '@/components/shared/TablePagination';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { role } from '@/constants/role';
import { UserStatus } from '@/constants/userStatus';
import { useGetAllUsersQuery } from '@/redux/features/User/user.api';
import type { IUser } from '@/types/user.types';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

const UserManagement = () => {
  const [searchParams] = useSearchParams();
  const [viewing, setViewing] = useState<string | null>(null);

  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const searchTerm = searchParams.get('searchTerm');

  const queryRole = searchParams.get('role');
  const accountStatus = searchParams.get('isActive');
  const isVerified = searchParams.get('isVerified');

  let sortQuery = '';
  if (sortBy) {
    sortQuery = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
  }

  const { data, isLoading } = useGetAllUsersQuery({
    searchTerm,
    sort: sortQuery,
    role: queryRole,
    isActive: accountStatus,
    isVerified,
    page,
    limit,
  });

  const handleView = (user: IUser) => {
    setViewing(user._id);
  };

  return (
    <div className='w-full mx-auto space-y-5'>
      <div className=''>
        <h1 className='text-4xl font-bold mb-3'>User Management</h1>
        <p className=''>Manage and oversee all user on the platform</p>
      </div>
      <div className='flex gap-3'>
        <SearchFilter />

        <div className='flex gap-3 items-center'>
          <span className='font-semibold'>Select Role :</span>
          <SelectFilter
            paramName='role'
            placeholder='Select Role'
            options={Object.keys(role).map((r) => {
              const key = r as keyof typeof role;

              return {
                label: r.charAt(0).toUpperCase() + r.slice(1),
                value: role[key],
              };
            })}
          />
        </div>

        <div className='flex gap-3 items-center'>
          <span className='font-semibold'>User Status :</span>
          <SelectFilter
            paramName='isVerified'
            placeholder='Select Status'
            options={[
              { label: 'Verified', value: 'true' },
              { label: 'Not Verified', value: 'false' },
            ].map((r) => ({
              label: r.label,
              value: r.value,
            }))}
          />
        </div>

        <div className='flex gap-3 items-center'>
          <span className='font-semibold'>Account Status :</span>
          <SelectFilter
            paramName='isActive'
            placeholder='Select Account Status'
            options={Object.keys(UserStatus).map((r) => {
              const key = r as keyof typeof UserStatus;
              return {
                label: r.charAt(0).toUpperCase() + r.slice(1),
                value: UserStatus[key],
              };
            })}
          />
        </div>
      </div>
      <RefreshButton />

      {isLoading ? (
        <TableSkeleton columns={8} rows={10} />
      ) : (
        <>
          <ManagementTable
            data={data?.data || []}
            columns={userColumns}
            getRowKey={(row) => row._id}
            isRefreshing={isLoading}
            onView={handleView}
          />
          <TablePagination
            currentPage={data?.meta?.page || 1}
            totalPages={data?.meta?.totalPage || 1}
          />
        </>
      )}

      <ViewUserDetails
        open={!!viewing}
        onClose={() => setViewing(null)}
        Id={viewing!}
      />
    </div>
  );
};

export default UserManagement;
