import { useEffect, useLayoutEffect, useRef } from "react";
import { ColorType, createChart, LineSeries } from "lightweight-charts";
import type { ReportSales } from "@/interface/report.interface";

interface Props {
  reportData: ReportSales[];
}

export default function ChartComponent({ reportData }: Props) {
  const $containerChartRef = useRef<HTMLDivElement>(null);

  const colors = {
    backgroundColor: "#eff1f5",
    lineColor: "#7c7f93",
    textColor: "#4c4f69",
  };

  useEffect(() => {
    if (!$containerChartRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: $containerChartRef.current?.clientWidth });
    };

    const chart = createChart($containerChartRef?.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: colors.backgroundColor,
        },
        textColor: colors.textColor,
        attributionLogo: false,
      },
      width: $containerChartRef.current.clientWidth,
      height: 300,
    });

    chart.applyOptions({
      crosshair: {
        horzLine: {
          labelBackgroundColor: colors.lineColor,
        },
        vertLine: {
          labelBackgroundColor: colors.lineColor,
        },
      },
    });
    chart.timeScale().fitContent();
    chart.timeScale().applyOptions({
      borderColor: colors.lineColor,
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: colors.lineColor,
    });
    console.log(reportData);
    lineSeries.priceScale().applyOptions({
      borderColor: colors.lineColor,
    });
    lineSeries.setData(
      reportData.map(({ date, sales }) => {
        return {
          time: date,
          value: sales,
        };
      })
    );

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [reportData, $containerChartRef.current?.clientWidth]);

  return <div ref={$containerChartRef} className="w-full h-80 px-3" />;
}
