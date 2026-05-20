import { grainData } from '../../data/grainData.js';

function GrainBarnVisual({ activeStep }) {
  const fillLevels = [42, 68, 88];
  const latest = grainData[grainData.length - 1];

  return (
    <div className="barn-card">
      <div className="barn">
        <div className="barn__roof" />
        <div className="barn__body">
          <div className="barn__grain" style={{ height: `${fillLevels[activeStep]}%` }} />
          <div className="barn__lines" />
        </div>
      </div>
      <div className="barn-card__copy">
        <p>粮仓填充度</p>
        <strong>{fillLevels[activeStep]}%</strong>
        <span>2023 mock：人均粮食 {latest.grainPerCapita} kg</span>
      </div>
    </div>
  );
}

export default GrainBarnVisual;
