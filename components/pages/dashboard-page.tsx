/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart3,
  Building,
  Calendar,
  CardSim,
  Home,
  Map,
  NotepadText,
  NotepadTextDashed,
  Package,
  PieChart,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportsWithAuth } from "@/hooks/use-reports";

import { Description, Heading1 } from "../atoms/typography";
import { StatCard } from "../molecules/stat-card";

// Type definitions
interface SummaryData {
  total_residents: number;
  average_age: number;
  min_age: number;
  max_age: number;
  total_rt: number;
  total_rw: number;
}

interface GenderDistribution {
  male: { count: number; percentage: number };
  female: { count: number; percentage: number };
}

interface AgeAnalysis {
  distribution: Record<string, number>;
  average_age: number;
  min_age: number;
  max_age: number;
  age_groups: Record<string, number>;
}

interface StatItem {
  count: number;
  percentage: number;
}

interface ResidentData {
  summary: SummaryData;
  gender_distribution: GenderDistribution;
  age_analysis: AgeAnalysis;
  religion_stats: Record<string, StatItem>;
  marital_stats: Record<string, StatItem>;
  education_stats: Record<string, StatItem>;
  occupation_stats: Record<string, StatItem>;
  geographical_distribution: {
    total_rt: number;
    total_rw: number;
    rt_distribution: Record<string, number>;
    rw_distribution: Record<string, number>;
  };
}

interface AssetSummary {
  total_assets: number;
  total_stock: number;
  available_stock: number;
  borrowed_stock: number;
}

interface AssetCategory {
  total_assets: number;
  total_stock: number;
  available_stock: number;
}

interface AssetData {
  summary: AssetSummary;
  group_by_type: Record<string, AssetCategory>;
}

interface LoanSummary {
  total_loans: number;
  requested: number;
  borrowed: number;
  returned: number;
  rejected: number;
}

interface AssetLoanGroup {
  total_loans: number;
  total_quantity: number;
}

interface AssetLoanData {
  summary: LoanSummary;
  top_assets: Record<string, number>;
  group_by_asset: Record<string, AssetLoanGroup>;
  percentage: Record<string, number>;
  active_quantity: number;
  group_by_type: Record<string, AssetLoanGroup>;
  average_duration_days: number;
  monthly: Record<string, number>;
  daily: Record<string, number>;
  top_loaners: any[];
}

interface FamilyCardRegion {
  id: number;
  name: string;
  encoded_geometry: string;
  created_at: string;
  updated_at: string;
}

interface LatestFamilyCard {
  id: number;
  family_card_number: string;
  head_of_family_name: string;
  address: string;
  publication_date: string;
  region_id: number;
  created_at: string;
  updated_at: string;
  region: FamilyCardRegion;
}

interface FamilyCardsData {
  total_family_cards: number;
  total_family_members: number;
  average_members_per_family: number;
  cards_by_region: Record<string, number>;
  latest_cards: LatestFamilyCard[];
  yearly_distribution: Record<string, number>;
}

interface ReportData {
  resident: ResidentData;
  asset: AssetData;
  asset_loan: AssetLoanData;
  family_cards: FamilyCardsData;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ReportData;
}

// Type guard
const isApiResponse = (data: unknown): data is ApiResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    "data" in data &&
    typeof (data as any).data === "object"
  );
};

export default function DashboardPage() {
  const { data, isLoading } = useReportsWithAuth();

  const reportData: ReportData | null = isApiResponse(data) ? data.data : null;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!reportData) {
    return (
      <div className="mx-auto p-6 container">
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <BarChart3 className="mb-4 w-12 h-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">Tidak ada data dashboard</h3>
            <p className="text-muted-foreground">
              Data dashboard tidak tersedia
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { resident, asset, asset_loan, family_cards } = reportData;

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <Heading1 text="Dashboard" />
        <Description text="Ringkasan data dari kelurahan" />
      </div>

      {/* Stats Grid */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Penduduk"
          value={resident.summary.total_residents}
          description="Total Penduduk Kelurahan"
          icon={Users}
        />
        <StatCard
          title="Kartu Keluarga"
          value={family_cards.total_family_cards}
          description="Total Kartu Keluarga"
          icon={CardSim}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100"
        />
        <StatCard
          title="Total Aset"
          value={asset.summary.total_assets}
          description="Total Aset Kelurahan"
          icon={Package}
          iconColor="bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100"
        />
        <StatCard
          title="Peminjaman"
          value={asset_loan.summary.total_loans}
          description="Total Peminjaman"
          icon={BarChart3}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-600 dark:text-purple-100"
        />
        <StatCard
          title="Aset Dipinjam"
          value={asset_loan.active_quantity}
          description="Aset Sedang Dipinjam"
          icon={TrendingUp}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-600 dark:text-amber-100"
        />
        <StatCard
          title="Rata-rata Usia"
          value={Math.round(resident.summary.average_age)}
          description="Usia Rata-rata Penduduk"
          icon={UserCheck}
          iconColor="bg-pink-100 text-pink-600 dark:bg-pink-600 dark:text-pink-100"
        />
      </div>

      <div className="gap-6 grid lg:grid-cols-2">
        {/* Demografi Penduduk */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Demografi Penduduk
            </CardTitle>
            <CardDescription>
              Distribusi penduduk berdasarkan jenis kelamin dan usia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Gender Distribution */}
              <div>
                <h3 className="mb-3 font-semibold">Jenis Kelamin</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Laki-laki</span>
                    <span className="font-semibold">
                      {resident.gender_distribution.male.count} (
                      {resident.gender_distribution.male.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={resident.gender_distribution.male.percentage}
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perempuan</span>
                    <span className="font-semibold">
                      {resident.gender_distribution.female.count} (
                      {resident.gender_distribution.female.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={resident.gender_distribution.female.percentage}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Age Distribution */}
              <div>
                <h3 className="mb-3 font-semibold">Distribusi Usia</h3>
                <div className="gap-3 grid grid-cols-2">
                  {Object.entries(resident.age_analysis.distribution).map(
                    ([range, count]) => (
                      <div key={range} className="p-3 border rounded-lg">
                        <p className="font-bold text-lg">{count}</p>
                        <p className="text-muted-foreground text-sm">
                          {range} tahun
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Aset */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Statistik Aset
            </CardTitle>
            <CardDescription>Ringkasan aset dan ketersediaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Asset Summary */}
              <div className="gap-4 grid grid-cols-2">
                <div className="bg-card p-4 border rounded-lg">
                  <p className="font-bold text-2xl">
                    {asset.summary.total_assets}
                  </p>
                  <p className="text-muted-foreground text-sm">Total Aset</p>
                </div>
                <div className="bg-card p-4 border rounded-lg">
                  <p className="font-bold text-green-600 dark:text-green-400 text-2xl">
                    {asset.summary.available_stock}
                  </p>
                  <p className="text-muted-foreground text-sm">Stok Tersedia</p>
                </div>
              </div>

              {/* Asset by Type */}
              <div>
                <h3 className="mb-3 font-semibold">Berdasarkan Tipe</h3>
                <div className="space-y-3">
                  {Object.entries(asset.group_by_type).map(([type, data]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {type}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                          {data.total_assets} aset
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {data.available_stock}/{data.total_stock}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          tersedia
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Peminjaman */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistik Peminjaman
            </CardTitle>
            <CardDescription>Ringkasan peminjaman aset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Loan Status */}
              <div className="gap-4 grid grid-cols-2">
                {Object.entries(asset_loan.percentage).map(
                  ([status, percentage]) => (
                    <div
                      key={status}
                      className="p-3 border rounded-lg text-center">
                      <p className="font-bold text-2xl">{percentage}%</p>
                      <p className="text-muted-foreground text-sm capitalize">
                        {status}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Top Assets */}
              <div>
                <h3 className="mb-3 font-semibold">
                  Aset Paling Sering Dipinjam
                </h3>
                <div className="space-y-2">
                  {Object.entries(asset_loan.top_assets).map(
                    ([assetName, count]) => (
                      <div
                        key={assetName}
                        className="flex justify-between items-center">
                        <span className="text-sm truncate">{assetName}</span>
                        <Badge variant="secondary">{count} kali</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kartu Keluarga Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Kartu Keluarga Terbaru
            </CardTitle>
            <CardDescription>5 kartu keluarga terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {family_cards.latest_cards.map((card) => (
                <div key={card.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {card.head_of_family_name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        No. KK: {card.family_card_number}
                      </p>
                    </div>
                    <Badge variant="outline">{card.region.name}</Badge>
                  </div>
                  <p className="mt-2 text-sm line-clamp-1">{card.address}</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Terbit:{" "}
                    {new Date(card.publication_date).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Agama dan Pendidikan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribusi Agama & Pendidikan
            </CardTitle>
            <CardDescription>
              Statistik agama dan pendidikan penduduk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gap-6 grid md:grid-cols-2">
              {/* Religion Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold">Agama</h3>
                <div className="space-y-3">
                  {Object.entries(resident.religion_stats).map(
                    ([religion, data]) => (
                      <div
                        key={religion}
                        className="flex justify-between items-center">
                        <span className="text-sm">{religion}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{data.count}</span>
                          <span className="text-muted-foreground text-xs">
                            ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Education Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold">Pendidikan</h3>
                <div className="space-y-3">
                  {Object.entries(resident.education_stats).map(
                    ([education, data]) => (
                      <div
                        key={education}
                        className="flex justify-between items-center">
                        <span className="text-sm">{education}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{data.count}</span>
                          <span className="text-muted-foreground text-xs">
                            ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Wilayah KK */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Distribusi Kartu Keluarga
            </CardTitle>
            <CardDescription>Berdasarkan wilayah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(family_cards.cards_by_region).map(
                ([region, count]) => (
                  <div
                    key={region}
                    className="flex justify-between items-center">
                    <span className="text-sm">{region}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress
                          value={
                            (count / family_cards.total_family_cards) * 100
                          }
                          className="h-2"
                        />
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Tahunan KK */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Distribusi Tahunan
            </CardTitle>
            <CardDescription>Kartu keluarga per tahun</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(family_cards.yearly_distribution).map(
                ([year, count]) => (
                  <div key={year} className="flex justify-between items-center">
                    <span className="text-sm">{year}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{count} KK</span>
                      <span className="text-muted-foreground text-xs">
                        (
                        {(
                          (count / family_cards.total_family_cards) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return (
    <div className="space-y-6 mx-auto p-6 container">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-96 h-4" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="rounded-full w-4 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-1 w-16 h-8" />
              <Skeleton className="w-20 h-3" />
              <Skeleton className="mt-2 w-32 h-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="gap-6 grid lg:grid-cols-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-64 h-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
