import plForecastChart from "@/assets/pl-forecast-chart.png";

const PLGrowthVisual = () => {
  return (
    <div className="space-y-6">
      {/* P/L Forecast Chart */}
      <div className="bg-white rounded-lg border border-border/50 p-4">
        <img
          src={plForecastChart}
          alt="Hobson P/L Forecast 2027-2031 showing Infrastructure/COGS, Operating Costs, and Net Profit growth"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="text-amber-600 font-semibold text-sm mb-1">Infrastructure / COGS</div>
          <div className="text-2xl font-bold text-amber-700">5-10%</div>
          <div className="text-xs text-amber-600/80">of revenue</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center">
          <div className="text-sky-600 font-semibold text-sm mb-1">Operating Costs</div>
          <div className="text-2xl font-bold text-sky-700">30-35%</div>
          <div className="text-xs text-sky-600/80">of revenue (early years)</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-emerald-600 font-semibold text-sm mb-1">Net Profit</div>
          <div className="text-2xl font-bold text-emerald-700">£4.5M</div>
          <div className="text-xs text-emerald-600/80">by 2031</div>
        </div>
      </div>
    </div>
  );
};

export default PLGrowthVisual;
