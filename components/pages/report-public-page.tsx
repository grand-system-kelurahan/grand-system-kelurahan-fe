/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart3,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  MapPin,
  Package,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportsPublic } from "@/hooks/use-reports";

interface ResidentSummary {
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
  age_groups: Record<string, number>;
  average_age: number;
  min_age: number;
  max_age: number;
}

interface StatItem {
  count: number;
  percentage: number;
}

interface ReligionStats {
  [key: string]: StatItem;
}

interface MaritalStats {
  [key: string]: StatItem;
}

interface EducationStats {
  [key: string]: StatItem;
}

interface OccupationStats {
  [key: string]: StatItem;
}

interface GeographicalDistribution {
  total_rt: number;
  total_rw: number;
  rt_distribution: Record<string, number>;
  rw_distribution: Record<string, number>;
}

interface ResidentData {
  summary: ResidentSummary;
  gender_distribution: GenderDistribution;
  age_analysis: AgeAnalysis;
  religion_stats: ReligionStats;
  marital_stats: MaritalStats;
  education_stats: EducationStats;
  occupation_stats: OccupationStats;
  geographical_distribution: GeographicalDistribution;
  summary_only: boolean;
}

interface AssetCategory {
  total_assets: number;
  total_stock: number;
  available_stock: number;
}

interface AssetStatusSummary {
  total_stock: number;
  available_stock: number;
  borrowed_stock: number;
}

interface AssetData {
  total_assets: number;
  asset_categories: Record<string, AssetCategory>;
  asset_status_summary: AssetStatusSummary;
  summary_only: boolean;
}

interface LoanStatistics {
  total_loans: number;
  requested: number;
  borrowed: number;
  returned: number;
  rejected: number;
  percentages: Record<string, number>;
}

interface GroupByAsset {
  [key: string]: {
    total_loans: number;
    total_quantity: number;
  };
}

interface GroupByType {
  [key: string]: {
    total_loans: number;
    total_quantity: number;
  };
}

interface AssetLoanData {
  total_active_loans: number;
  total_completed_loans: number;
  loan_statistics: LoanStatistics;
  top_assets: Record<string, number>;
  group_by_asset: GroupByAsset;
  active_quantity: number;
  group_by_type: GroupByType;
  average_duration_days: number;
  monthly_trends: Record<string, number>;
  daily_trends: Record<string, number>;
  summary_only: boolean;
}

interface FamilyCardsData {
  total_family_cards: number;
  total_family_members: number;
  average_members_per_family: number;
  regional_distribution: Record<string, number>;
  yearly_distribution: Record<string, number>;
  summary_only: boolean;
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

export default function ReportPublicPage() {
  const { data, isLoading } = useReportsPublic();

  // Type guard to check if data is ApiResponse
  const isApiResponse = (data: unknown): data is ApiResponse => {
    return (
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      "data" in data &&
      typeof (data as any).data === "object"
    );
  };

  const reportData: ReportData | null = isApiResponse(data) ? data.data : null;

  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (!reportData) {
    return (
      <div className="mx-auto p-6 container">
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <BarChart3 className="mb-4 w-12 h-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">Tidak ada data laporan</h3>
            <p className="text-muted-foreground">
              Data laporan publik tidak tersedia
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { resident, asset, asset_loan, family_cards } = reportData;

  return (
    <div className="space-y-6 mx-auto p-4 md:p-6 container">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Dashboard Publik</h1>
        <p className="text-muted-foreground">
          Statistik dan laporan terintegrasi wilayah
        </p>
      </div>

      {/* Summary Stats */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penduduk"
          value={resident.summary.total_residents}
          icon={Users}
          description="Jiwa"
          trend={`RT: ${resident.summary.total_rt} | RW: ${resident.summary.total_rw}`}
        />
        <StatCard
          title="Kartu Keluarga"
          value={family_cards.total_family_cards}
          icon={Home}
          description="KK"
          trend={`Rata-rata ${family_cards.average_members_per_family.toFixed(
            1
          )} anggota/KK`}
        />
        <StatCard
          title="Total Aset"
          value={asset.total_assets}
          icon={Package}
          description="Barang"
          trend={`${asset.asset_status_summary.available_stock} tersedia`}
        />
        <StatCard
          title="Peminjaman Aktif"
          value={asset_loan.total_active_loans}
          icon={BarChart3}
          description="Aktif"
          trend={`${asset_loan.total_completed_loans} selesai`}
        />
      </div>

      <div className="gap-6 grid lg:grid-cols-2">
        {/* Demografi Penduduk */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Demografi Penduduk
            </CardTitle>
            <CardDescription>
              Distribusi penduduk berdasarkan karakteristik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gap-6 grid md:grid-cols-2">
              {/* Gender Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold">Jenis Kelamin</h3>
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
              <div className="space-y-4">
                <h3 className="font-semibold">Distribusi Usia</h3>
                <div className="space-y-2">
                  {Object.entries(resident.age_analysis.distribution).map(
                    ([range, count]) => (
                      <div
                        key={range}
                        className="flex justify-between items-center">
                        <span className="text-sm">{range} tahun</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    )
                  )}
                </div>
                <div className="pt-2 border-t">
                  <p className="text-muted-foreground text-sm">
                    Rata-rata usia:{" "}
                    <span className="font-semibold">
                      {resident.summary.average_age.toFixed(1)} tahun
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agama dan Status */}
        <div className="space-y-6">
          {/* Religion Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Agama
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Education Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Asset and Loans */}
        <div className="space-y-6">
          {/* Asset Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Kategori Aset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid md:grid-cols-2">
                {Object.entries(asset.asset_categories).map(
                  ([category, catData]) => (
                    <div
                      key={category}
                      className="space-y-2 bg-card p-4 border rounded-lg">
                      <h4 className="font-semibold capitalize">{category}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Total Aset</span>
                          <span className="font-semibold">
                            {catData.total_assets}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Stok Total</span>
                          <span className="font-semibold">
                            {catData.total_stock}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Stok Tersedia</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {catData.available_stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loan Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistik Peminjaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="gap-4 grid grid-cols-2">
                  {Object.entries(asset_loan.loan_statistics.percentages).map(
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
                <div className="pt-4 border-t">
                  <p className="text-muted-foreground text-sm">
                    Total peminjaman:{" "}
                    <span className="font-semibold">
                      {asset_loan.loan_statistics.total_loans}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Family Cards Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Distribusi Kartu Keluarga
            </CardTitle>
            <CardDescription>
              Penyebaran KK berdasarkan wilayah dan tahun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gap-6 grid md:grid-cols-2">
              {/* Regional Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold">Berdasarkan Wilayah</h3>
                <div className="space-y-3 pr-2 max-h-60 overflow-y-auto">
                  {Object.entries(family_cards.regional_distribution).map(
                    ([region, count]) => (
                      <div
                        key={region}
                        className="flex justify-between items-center">
                        <span className="text-sm truncate">{region}</span>
                        <span className="font-semibold">{count} KK</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Yearly Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold">Berdasarkan Tahun</h3>
                <div className="space-y-3">
                  {Object.entries(family_cards.yearly_distribution).map(
                    ([year, count]) => (
                      <div
                        key={year}
                        className="flex justify-between items-center">
                        <span className="text-sm">{year}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Occupation Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Pekerjaan
            </CardTitle>
            <CardDescription>10 pekerjaan terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(resident.occupation_stats).map(
                ([occupation, data]) => (
                  <div
                    key={occupation}
                    className="flex justify-between items-center">
                    <span className="text-sm truncate">{occupation}</span>
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
          </CardContent>
        </Card>

        {/* Geographical Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Distribusi RT/RW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="gap-4 grid grid-cols-2">
                <div className="bg-card p-4 border rounded-lg text-center">
                  <p className="font-bold text-2xl">
                    {resident.geographical_distribution.total_rt}
                  </p>
                  <p className="text-muted-foreground text-sm">Total RT</p>
                </div>
                <div className="bg-card p-4 border rounded-lg text-center">
                  <p className="font-bold text-2xl">
                    {resident.geographical_distribution.total_rw}
                  </p>
                  <p className="text-muted-foreground text-sm">Total RW</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm text-center">
                Terdistribusi merata di semua RT/RW
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value.toLocaleString()}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
        <p className="mt-2 text-muted-foreground text-xs">{trend}</p>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function ReportSkeleton() {
  return (
    <div className="space-y-6 mx-auto p-6 container">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-96 h-4" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
