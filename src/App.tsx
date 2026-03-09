import React, { useState, useEffect } from 'react';
import { Home, Settings, Package, Plus, Trash2, Zap, Percent, Scale, RefreshCw, Clock, Cpu, Banknote } from 'lucide-react';
import './index.css';

// Types
interface Filament {
  id: string;
  name: string;
  color: string;
  pricePerKg: number;
}

interface AppSettings {
  margin: number;
  electricityCost: number;
  wattsUsed: number;
  purgeGramsPerChange: number;
  machinePrice: number;
  currencyCode: string;
}

interface MultiUsage {
  filamentId: string;
  grams: number;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    const defaultSettings = {
      margin: 20,
      electricityCost: 0.15,
      wattsUsed: 250,
      purgeGramsPerChange: 0.5,
      machinePrice: 500,
      currencyCode: 'USD'
    };
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved);
    return { ...defaultSettings, ...parsed };
  });

  // Filaments State
  const [filaments, setFilaments] = useState<Filament[]>(() => {
    const saved = localStorage.getItem('filaments');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'PLA Black', color: '#000000', pricePerKg: 20 },
      { id: '2', name: 'PLA White', color: '#ffffff', pricePerKg: 20 }
    ];
  });

  // Calculation State (Home Page)
  const [isMultimaterial, setIsMultimaterial] = useState<boolean>(false);
  const [pricingMode, setPricingMode] = useState<'per-filament' | 'override'>('per-filament');
  const [overrideFilamentId, setOverrideFilamentId] = useState<string>(filaments[0]?.id || '');

  const [totalGrams, setTotalGrams] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [changes, setChanges] = useState<number>(0);
  const [selectedFilamentId, setSelectedFilamentId] = useState<string>(filaments[0]?.id || '');

  const [multiUsage, setMultiUsage] = useState<MultiUsage[]>([]);

  // Effects
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('filaments', JSON.stringify(filaments));
  }, [filaments]);

  // Currency helper
  const currencySymbol = currencies.find(c => c.code === settings.currencyCode)?.symbol || '$';

  // Derived Values
  const calculateResults = () => {
    let filamentUsageCost = 0;
    const totalTimeHours = hours + (minutes / 60);

    // Filament Cost Calculation
    if (isMultimaterial) {
      if (pricingMode === 'per-filament') {
        multiUsage.forEach(usage => {
          const filament = filaments.find(f => f.id === usage.filamentId);
          if (filament) {
            filamentUsageCost += (usage.grams / 1000) * filament.pricePerKg;
          }
        });
      } else {
        const overrideFilament = filaments.find(f => f.id === overrideFilamentId);
        if (overrideFilament) {
          const totalMultiGrams = multiUsage.reduce((acc, curr) => acc + curr.grams, 0);
          filamentUsageCost = (totalMultiGrams / 1000) * overrideFilament.pricePerKg;
        }
      }
    } else {
      const selectedFilament = filaments.find(f => f.id === selectedFilamentId);
      if (selectedFilament) {
        filamentUsageCost = (totalGrams / 1000) * selectedFilament.pricePerKg;
      }
    }

    // Purge Waste Cost
    const purgePrice = isMultimaterial
      ? (pricingMode === 'override' ? (filaments.find(f => f.id === overrideFilamentId)?.pricePerKg || 20) : (filaments.find(f => f.id === multiUsage[0]?.filamentId)?.pricePerKg || filaments[0]?.pricePerKg || 20))
      : (filaments.find(f => f.id === selectedFilamentId)?.pricePerKg || 20);

    const purgeGrams = changes * settings.purgeGramsPerChange;
    const purgeCost = (purgeGrams / 1000) * purgePrice;

    // Waste Cost
    const baseFilamentPrice = filamentUsageCost;
    const basicWasteCost = baseFilamentPrice * 0.05;
    const totalFilamentRelatedCost = baseFilamentPrice + basicWasteCost + purgeCost;

    // Warm-up Cost (6 mins @ 800W)
    const warmupEnergyKWh = (6 / 60) * (800 / 1000);
    const warmupCost = warmupEnergyKWh * settings.electricityCost;

    // Electricity Cost
    const printEnergyKWh = totalTimeHours * (settings.wattsUsed / 1000);
    const mainElectricityCost = printEnergyKWh * settings.electricityCost;
    const totalElectricityCost = mainElectricityCost + warmupCost;

    // Machine Deprecation Cost (MachinePrice / 4000 hours)
    const deprecationHourRate = settings.machinePrice / 4000;
    const deprecationCost = totalTimeHours * deprecationHourRate;

    // Total Base Cost
    const totalBaseCost = totalFilamentRelatedCost + totalElectricityCost + deprecationCost;

    // Final Price with Margin
    const finalPrice = totalBaseCost * (1 + settings.margin / 100);

    return {
      filamentCost: baseFilamentPrice.toFixed(2),
      electricityCost: totalElectricityCost.toFixed(2),
      wasteCost: (basicWasteCost + purgeCost).toFixed(2),
      deprecationCost: deprecationCost.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      baseCost: totalBaseCost.toFixed(2),
      warmupCost: warmupCost.toFixed(2)
    };
  };

  const results = calculateResults();

  // Handlers
  const addFilamentToPrint = () => {
    if (filaments.length > 0) {
      setMultiUsage([...multiUsage, { filamentId: filaments[0].id, grams: 0 }]);
    }
  };

  const updateMultiUsage = (index: number, updates: Partial<MultiUsage>) => {
    const newList = [...multiUsage];
    newList[index] = { ...newList[index], ...updates };
    setMultiUsage(newList);
  };

  const removeMultiUsage = (index: number) => {
    setMultiUsage(multiUsage.filter((_, i) => i !== index));
  };

  const addFilament = () => {
    const newFilament: Filament = {
      id: Date.now().toString(),
      name: 'New Filament',
      color: '#6366f1',
      pricePerKg: 20
    };
    setFilaments([...filaments, newFilament]);
  };

  const updateFilament = (id: string, updates: Partial<Filament>) => {
    setFilaments(filaments.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFilament = (id: string) => {
    setFilaments(filaments.filter(f => f.id !== id));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <Package size={24} color="#6366f1" />
            <span style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>3DP COST</span>
          </h2>

          <nav className="nav-menu">
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={20} /> Home
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} /> Settings
              </a>
            </li>
          </nav>
        </div>

        <div className="sidebar-footer">
          Created By Kornilio Tribalis With ❤
        </div>
      </aside>

      <main className="main-content animate-fade">
        {activeTab === 'home' ? (
          <div>
            <h1>Cost Calculator</h1>

            <div className="grid-2">
              <section className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ marginBottom: 0 }}>Print Details</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Multimaterial</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={isMultimaterial}
                        onChange={(e) => setIsMultimaterial(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {!isMultimaterial ? (
                  <>
                    <div className="input-group">
                      <label><Scale size={14} style={{ marginRight: '4px' }} /> Total Grams Used</label>
                      <input
                        type="number"
                        min="0"
                        value={totalGrams || ''}
                        onChange={(e) => setTotalGrams(Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                      />
                    </div>

                    <div className="input-group">
                      <label><Package size={14} style={{ marginRight: '4px' }} /> Select Filament</label>
                      <select
                        value={selectedFilamentId}
                        onChange={(e) => setSelectedFilamentId(e.target.value)}
                      >
                        {filaments.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({currencySymbol}{f.pricePerKg}/kg)</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <label>Pricing Mode</label>
                      <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value as any)}>
                        <option value="per-filament">Calculate per Filament used</option>
                        <option value="override">Use one filament price for all</option>
                      </select>
                    </div>

                    {pricingMode === 'override' && (
                      <div className="input-group">
                        <label><Package size={14} style={{ marginRight: '4px' }} /> Select Price Source Filament</label>
                        <select
                          value={overrideFilamentId}
                          onChange={(e) => setOverrideFilamentId(e.target.value)}
                        >
                          {filaments.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({currencySymbol}{f.pricePerKg}/kg)</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ margin: 0 }}>Filaments Used</label>
                        <button className="btn btn-secondary" onClick={addFilamentToPrint} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                          <Plus size={14} /> Add
                        </button>
                      </div>

                      {multiUsage.map((usage, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                          <select
                            value={usage.filamentId}
                            onChange={(e) => updateMultiUsage(idx, { filamentId: e.target.value })}
                            style={{ padding: '0.6rem' }}
                          >
                            {filaments.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            value={usage.grams || ''}
                            onChange={(e) => updateMultiUsage(idx, { grams: Math.max(0, Number(e.target.value)) })}
                            placeholder="Grams"
                            style={{ padding: '0.6rem' }}
                          />
                          <button
                            className="btn btn-secondary"
                            onClick={() => removeMultiUsage(idx)}
                            style={{ padding: '0.6rem', color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label><Clock size={14} style={{ marginRight: '4px' }} /> Print Time (HH:MM)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        value={hours || ''}
                        onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                        placeholder="Hours"
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>h</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes || ''}
                        onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                        placeholder="Minutes"
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>m</span>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label><RefreshCw size={14} style={{ marginRight: '4px' }} /> Filament Changes</label>
                  <input
                    type="number"
                    min="0"
                    value={changes || ''}
                    onChange={(e) => setChanges(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                  />
                </div>
              </section>

              <section className="card">
                <h2>Results</h2>

                <div className="result-item">
                  <span>Filament Cost</span>
                  <span>{currencySymbol}{results.filamentCost}</span>
                </div>

                <div className="result-item">
                  <span>Electricity Cost</span>
                  <div style={{ textAlign: 'right' }}>
                    <div>{currencySymbol}{results.electricityCost}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>incl. warmup routine: {currencySymbol}{results.warmupCost}</div>
                  </div>
                </div>

                <div className="result-item">
                  <span>Waste Cost</span>
                  <span>{currencySymbol}{results.wasteCost}</span>
                </div>

                <div className="result-item">
                  <span>Machine Deprecation</span>
                  <span>{currencySymbol}{results.deprecationCost}</span>
                </div>

                <div className="result-item">
                  <span>Base Cost</span>
                  <span>{currencySymbol}{results.baseCost}</span>
                </div>

                <div className="result-item" style={{ border: 'none', marginTop: '1.5rem' }}>
                  <span style={{ fontWeight: '600' }}>Final Price (incl. Margin)</span>
                  <span className="price-total">{currencySymbol}{results.finalPrice}</span>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div>
            <h1>Settings</h1>

            <div className="card">
              <h2>Global Defaults</h2>
              <div className="grid-2">
                <div className="input-group">
                  <label><Percent size={14} style={{ marginRight: '4px' }} /> Profit Margin (%)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.margin}
                    onChange={(e) => setSettings({ ...settings, margin: Math.max(0, Number(e.target.value)) })}
                  />
                </div>
                <div className="input-group">
                  <label><Banknote size={14} style={{ marginRight: '4px' }} /> Preferred Currency</label>
                  <select
                    value={settings.currencyCode}
                    onChange={(e) => setSettings({ ...settings, currencyCode: e.target.value })}
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name} ({c.symbol})</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label><Zap size={14} style={{ marginRight: '4px' }} /> Electricity Cost ({currencySymbol}/kWh)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.electricityCost}
                    onChange={(e) => setSettings({ ...settings, electricityCost: Math.max(0, Number(e.target.value)) })}
                  />
                </div>
                <div className="input-group">
                  <label><Zap size={14} style={{ marginRight: '4px' }} /> Printer Power (Watts) while printing</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.wattsUsed}
                    onChange={(e) => setSettings({ ...settings, wattsUsed: Math.max(0, Number(e.target.value)) })}
                  />
                </div>
                <div className="input-group">
                  <label><Scale size={14} style={{ marginRight: '4px' }} /> Purge waste (grams per change)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={settings.purgeGramsPerChange}
                    onChange={(e) => setSettings({ ...settings, purgeGramsPerChange: Math.max(0, Number(e.target.value)) })}
                  />
                </div>
                <div className="input-group">
                  <label><Cpu size={14} style={{ marginRight: '4px' }} /> Machine Price ({currencySymbol}) - 4000h deprecation</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.machinePrice}
                    onChange={(e) => setSettings({ ...settings, machinePrice: Math.max(0, Number(e.target.value)) })}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: 0 }}>Filament Library</h2>
                <button className="btn" onClick={addFilament} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
                  <Plus size={18} /> Add Filament
                </button>
              </div>

              {filaments.map(filament => (
                <div key={filament.id} className="grid-2" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={filament.name}
                      onChange={(e) => updateFilament(filament.id, { name: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Color</label>
                      <input
                        type="color"
                        value={filament.color}
                        onChange={(e) => updateFilament(filament.id, { color: e.target.value })}
                        style={{ height: '45px', padding: '4px' }}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Price / kg ({currencySymbol})</label>
                      <input
                        type="number"
                        min="0"
                        value={filament.pricePerKg}
                        onChange={(e) => updateFilament(filament.id, { pricePerKg: Math.max(0, Number(e.target.value)) })}
                      />
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => deleteFilament(filament.id)}
                      style={{ height: '45px', width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#ef4444' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
