"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import DashboardCharts from "@/components/DashboardCharts";
import Tabs from "@/components/Tabs/Tabs";
import useDashboardCharts from "@/hooks/hermes/useDashboardCharts";
import useDashboardStats from "@/hooks/hermes/useDashboardStats";
import useTwoWayPegGuardianSettings from "@/hooks/hermes/useTwoWayPegGuardianSettings";
import usePrice from "@/hooks/misc/usePrice";
import { ChartDataPoint } from "@/types/chart";
import { fillChartData } from "@/utils/chart";
import { BTC_DECIMALS } from "@/utils/constant";
import { CryptoCurrency } from "@/types/misc";
import CryptoInfoCard from "@/components/CryptoInfo/CryptoInfoCard";

const timelineTabs = [
  { label: "Day" },
  { label: "Week" },
  { label: "Month" },
  { label: "Year" },
  { label: "All" },
];

const timelineTabsMobile = [
  { label: "D" },
  { label: "W" },
  { label: "M" },
  { label: "Y" },
  { label: "All" },
];

const defaultChartData = [{ date: new Date("2024-04-04"), value: 0 }];

export default function DashboardPage() {
  const [selectedTimelineTab, setSelectedTimelineTab] = useState(
    timelineTabs.indexOf(timelineTabs[4])
  );
  const { price: btcPrice, priceChangePercent: btcPriceChange } = usePrice("BTC");
  const { price: dogePrice, priceChangePercent: dogePriceChange } = usePrice("DOGE");
  const { price: ltcPrice, priceChangePercent: ltcPriceChange } = usePrice("LTC");
  const { data: twoWayPegGuardianSettings } = useTwoWayPegGuardianSettings();
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats(
    twoWayPegGuardianSettings.map((item) => item.address)
  );
  const { data: chartsData, isLoading: isChartsLoading } = useDashboardCharts(
    twoWayPegGuardianSettings.map((item) => item.address)
  );

  const isLoading = isStatsLoading || isChartsLoading;

  const recentDayHourlyHotReserveBucketsChartData: ChartDataPoint[] = chartsData
    ? fillChartData(
      chartsData.recentDayHourlyHotReserveBucketsChartData,
      24,
      "hour"
    )
    : defaultChartData;

  const recentWeekDailyHotReserveBucketsChartData: ChartDataPoint[] = chartsData
    ? fillChartData(
      chartsData.recentWeekDailyHotReserveBucketsChartData,
      7,
      "day"
    )
    : defaultChartData;

  const recentMonthDailyHotReserveBucketsChartData: ChartDataPoint[] =
    chartsData
      ? fillChartData(
        chartsData.recentMonthDailyHotReserveBucketsChartData,
        31,
        "day"
      )
      : defaultChartData;

  const allWeeklyHotReserveBucketsChartData: ChartDataPoint[] =
    chartsData?.allWeeklyHotReserveBucketsChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: data.value,
    })) ?? defaultChartData;

  const recentDayHourlyVolumeChartData: ChartDataPoint[] = chartsData
    ? fillChartData(
      chartsData.recentDayHourlyVolumeChartData,
      24,
      "hour",
      btcPrice
    )
    : defaultChartData;

  const recentWeekDailyVolumeData: ChartDataPoint[] = chartsData
    ? fillChartData(
      chartsData.recentWeekDailyVolumeChartData,
      7,
      "day",
      btcPrice
    )
    : defaultChartData;

  const recentMonthDailyVolumeData: ChartDataPoint[] = chartsData
    ? fillChartData(
      chartsData.recentMonthDailyVolumeChartData,
      31,
      "day",
      btcPrice
    )
    : defaultChartData;

  const allWeeklyVolumeChartData: ChartDataPoint[] =
    chartsData?.allWeeklyVolumeChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData;

  const recentDayHourlyAmountChartData: ChartDataPoint[] =
    chartsData?.recentDayHourlyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData;

  const recentWeekDailyAmountChartData: ChartDataPoint[] =
    chartsData?.recentWeekDailyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData;

  const recentMonthDailyAmountChartData: ChartDataPoint[] =
    chartsData?.recentMonthDailyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData;

  const allWeeklyAmountChartData: ChartDataPoint[] =
    chartsData?.allWeeklyAmountChartData.map((data) => ({
      date: new Date(data.time * 1000),
      value: (data.value / 10 ** BTC_DECIMALS) * btcPrice,
    })) ?? defaultChartData;

  const tvl = recentWeekDailyAmountChartData.at(-1)?.value ?? 0;

  const handleSetSelectedTimelineTab = (index: number) => {
    setSelectedTimelineTab(index);
  };

  return (
    <main className="page-content ds">
      <motion.div
        className="md:px-apollo-10 mt-32 flex flex-col gap-y-6 sm:flex-row sm:items-center sm:justify-between sm:gap-y-16 md:mt-48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-white text-2xl ">
          <b>Dashboard</b>
        </span>
        <Tabs
          className="!hidden sm:!flex"
          type="timeline"
          activeTab={selectedTimelineTab}
          tabs={timelineTabs}
          setActiveTab={handleSetSelectedTimelineTab}
          layoutName="timeline-tab"
        />
        <Tabs
          className="!flex sm:!hidden"
          type="timeline"
          activeTab={selectedTimelineTab}
          tabs={timelineTabsMobile}
          setActiveTab={handleSetSelectedTimelineTab}
          layoutName="timeline-tab-mobile"
        />
      </motion.div>

      <DashboardCharts
        showHourlyTimestamps={selectedTimelineTab === 0}
        isLoading={isLoading}
        btcPrice={btcPrice}
        selectedTimeline={selectedTimelineTab}
        tvl={tvl}
        totalVolume={statsData ? statsData.totalVolume * btcPrice : 0}
        uniqueWallets={statsData?.totalUniqueWallets ?? 0}
        recentDayHourlyHotReserveBucketsChartData={
          recentDayHourlyHotReserveBucketsChartData
        }
        recentWeekDailyHotReserveBucketsChartData={
          recentWeekDailyHotReserveBucketsChartData
        }
        recentMonthDailyHotReserveBucketsChartData={
          recentMonthDailyHotReserveBucketsChartData
        }
        allWeeklyHotReserveBucketsChartData={
          allWeeklyHotReserveBucketsChartData
        }
        recentDayHourlyVolumeChartData={recentDayHourlyVolumeChartData}
        recentWeekDailyVolumeChartData={recentWeekDailyVolumeData}
        recentMonthDailyVolumeChartData={recentMonthDailyVolumeData}
        allWeeklyVolumeChartData={allWeeklyVolumeChartData}
        recentDayHourlyAmountChartData={recentDayHourlyAmountChartData}
        recentWeekDailyAmountChartData={recentWeekDailyAmountChartData}
        recentMonthDailyAmountChartData={recentMonthDailyAmountChartData}
        allWeeklyAmountChartData={allWeeklyAmountChartData}
      />

      <div className="page__section mb-8">
        <h2 className="text-xl font-bold mb-4">Supported Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CryptoInfoCard
            cryptoType={CryptoCurrency.BTC}
            price={btcPrice}
            change24h={btcPriceChange}
          />
          <CryptoInfoCard
            cryptoType={CryptoCurrency.DOGE}
            price={dogePrice}
            change24h={dogePriceChange}
          />
          <CryptoInfoCard
            cryptoType={CryptoCurrency.LTC}
            price={ltcPrice}
            change24h={ltcPriceChange}
          />
        </div>
      </div>
    </main>
  );
}
