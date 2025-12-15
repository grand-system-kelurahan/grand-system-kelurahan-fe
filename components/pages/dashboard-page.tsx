import {
  CardSim,
  Map,
  NotepadText,
  NotepadTextDashed,
  Users,
} from "lucide-react";

import { Description, Heading1 } from "../atoms/typography";
import { StatCard } from "../molecules/stat-card";

export default function DashboardPage() {
  return (
    <div className="">
      <Heading1 text="Dashboard" />
      <Description text="Ringkasan data dari kelurahan" />
      <hr className="my-4" />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Lingkungan"
          value={10}
          description="Total Lingkungan Kelurahan"
          icon={Map}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-600 dark:text-amber-100"
        />
        <StatCard
          title="Penduduk"
          value={100}
          description="Total Penduduk Kelurahan"
          icon={Users}
        />
        <StatCard
          title="Kartu Keluarga"
          value={10}
          description="Total Kartu Keluarga Kelurahan"
          icon={CardSim}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100"
        />
        <StatCard
          title="Jenis Surat"
          value={10}
          description="Total Jenis Surat"
          icon={NotepadText}
          iconColor="bg-violet-100 text-violet-600 dark:bg-violet-600 dark:text-violet-100"
        />
        <StatCard
          title="Surat Masuk"
          value={10}
          description="Total pengajuan surat"
          icon={NotepadTextDashed}
          iconColor="bg-cyan-100 text-cyan-600 dark:bg-cyan-600 dark:text-cyan-100"
        />
        <StatCard
          title="Surat Keluar"
          value={10}
          description="Total surat diterbitkan"
          icon={NotepadTextDashed}
          iconColor="bg-pink-100 text-pink-600 dark:bg-pink-600 dark:text-pink-100"
        />
      </div>
    </div>
  );
}
