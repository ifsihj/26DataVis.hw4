/**
 * data-loader.js — 数据加载与清洗
 * 加载 processed/ 目录下的真实数据集
 * 数据来源：国家统计局年度数据 (1949-2025) / FAO
 */
const DataLoader = {
  _cache: {},

  /**
   * 加载 CSV 文件，返回 Promise<Array>
   */
  loadCSV: function(filename) {
    if (this._cache[filename]) return this._cache[filename];
    const promise = d3.csv(CONFIG.dataPath(filename), d3.autoType).then(data => {
      this._cache[filename] = data;
      return data;
    });
    this._cache[filename] = promise;
    return promise;
  },

  /**
   * 加载 JSON 文件
   */
  loadJSON: function(filename) {
    if (this._cache[filename]) return this._cache[filename];
    const promise = d3.json(CONFIG.dataPath(filename)).then(data => {
      this._cache[filename] = data;
      return data;
    });
    this._cache[filename] = promise;
    return promise;
  },

  /**
   * 加载所有核心数据 (用于仪表盘)
   */
  loadAll: async function() {
    const [
      grainOutput,
      perCapitaGrain,
      dietStructure,
      selfSufficiency,
      agriTechnology,
      worldComparison,
      arableLand,
      keyEvents,
    ] = await Promise.all([
      this.loadCSV('grain_output.csv'),
      this.loadCSV('per_capita_grain.csv'),
      this.loadCSV('diet_structure.csv'),
      this.loadCSV('self_sufficiency.csv'),
      this.loadCSV('agri_technology.csv'),
      this.loadCSV('world_comparison.csv'),
      this.loadCSV('arable_land.csv'),
      this.loadJSON('key_events.json'),
    ]);

    CONFIG.keyEvents = keyEvents;

    return {
      grainOutput,
      perCapitaGrain,
      dietStructure,
      selfSufficiency,
      agriTechnology,
      worldComparison,
      arableLand,
      keyEvents,
    };
  },

  /**
   * 加载 FAO 数据
   */
  loadFAO: async function() {
    const [faoProduction, faoTopCrops] = await Promise.all([
      this.loadCSV('fao_production_value.csv'),
      this.loadCSV('fao_top_crops.csv'),
    ]);
    return { faoProduction, faoTopCrops };
  },
};
