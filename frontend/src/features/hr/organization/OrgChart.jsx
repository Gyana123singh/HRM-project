import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { orgChartData } from '../../../data/mockData';
import { Users, ChevronDown, Network } from 'lucide-react';

const OrgTreeNode = ({ node }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-card p-4 rounded-2xl border border-slate-700/80 shadow-xl text-center w-56 hover:border-indigo-500 transition-all group">
        <Avatar src={node.avatar} name={node.name} size="lg" className="mx-auto mb-2 group-hover:scale-105 transition-transform" />
        <h4 className="text-sm font-bold text-slate-100">{node.name}</h4>
        <p className="text-xs text-indigo-400 font-semibold mt-0.5">{node.title}</p>
        <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 font-mono rounded-full">
          {node.department}
        </span>
      </div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-0.5 h-6 bg-indigo-500/50 my-1" />
          <div className="flex flex-wrap justify-center gap-6 relative before:absolute before:top-0 before:left-1/4 before:right-1/4 before:h-0.5 before:bg-indigo-500/50">
            {node.children.map((child, idx) => (
              <OrgTreeNode key={idx} node={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const OrgChart = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Organization Chart"
        subtitle="Visual reporting hierarchy across executive, engineering, product, and sales units."
        breadcrumbs={['Organization', 'Org Chart']}
      />

      <Card className="overflow-x-auto p-8 flex justify-center no-scrollbar min-h-[500px]">
        <OrgTreeNode node={orgChartData} />
      </Card>
    </div>
  );
};
