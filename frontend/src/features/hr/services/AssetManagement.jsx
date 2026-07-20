import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { assetInventory } from '../../../data/mockData';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AssetManagement = () => {
  const columns = [
    { header: 'Asset ID', accessorKey: 'assetId' },
    { header: 'Equipment Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Assigned To', accessorKey: 'assignedTo' },
    { header: 'Assigned Date', accessorKey: 'assignedDate' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button onClick={() => toast.info(`Managing asset ${row.assetId}`)} variant="outline" size="sm">
          Re-Assign / Return
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hardware & Asset Inventory"
        subtitle="Manage company laptops, monitors, access cards, and security peripherals."
        breadcrumbs={['Employee Services', 'Asset Management']}
        actions={
          <Button onClick={() => toast.info('Add new hardware item')} variant="primary" icon={Plus}>
            Add Asset
          </Button>
        }
      />

      <DataTable columns={columns} data={assetInventory} />
    </div>
  );
};
