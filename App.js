import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Switch, Alert, StatusBar
} from 'react-native';

export default function App() {
  const [view, setView] = useState('DIAGNOSTIC');

  // --- Wealth Diagnostic States ---
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [debt, setDebt] = useState('');
  const [sip, setSip] = useState('');
  const [expenses, setExpenses] = useState(''); 
  const [equity, setEquity] = useState('');
  const [gold, setGold] = useState('');
  const [realEstate, setRealEstate] = useState('');
  const [fixedDeposit, setFixedDeposit] = useState(''); 
  const [nps, setNps] = useState('');                   
  const [pf, setPf] = useState('');                     
  const [ppf, setPpf] = useState('');                   
  const [others, setOthers] = useState('');             
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creditCardDebt, setCreditCardDebt] = useState('');
  const [unorganisedDebt, setUnorganisedDebt] = useState('');
  const [report, setReport] = useState(null);

  // --- SIP Calculator States ---
  const [sipMonthly, setSipMonthly] = useState('');
  const [sipRate, setSipRate] = useState('');
  const [sipYears, setSipYears] = useState('');
  const [sipResult, setSipResult] = useState(null);

  // --- Diagnostic Rule Execution ---
  const generateReport = () => {
    const userAge = parseInt(age) || 0;
    const monthlyInc = parseFloat(income) || 0;
    const annualIncome = monthlyInc * 12;
    const monthlyExp = parseFloat(expenses) || 0;

    const totalAssets = (parseFloat(equity) || 0) + 
                        (parseFloat(gold) || 0) + 
                        (parseFloat(realEstate) || 0) +
                        (parseFloat(fixedDeposit) || 0) +
                        (parseFloat(nps) || 0) +
                        (parseFloat(pf) || 0) +
                        (parseFloat(ppf) || 0) +
                        (parseFloat(others) || 0);

    const netVal = totalAssets - (parseFloat(creditCardDebt) || 0) - (parseFloat(unorganisedDebt) || 0);

    if (!userAge || monthlyInc <= 0) {
      Alert.alert("Input Error", "Please provide a valid Age and Monthly Income.");
      return;
    }

    // --- 1. Stanley Benchmark ---
    const expectedNetWorth = (userAge * annualIncome) / 10;
    const wealthRatio = expectedNetWorth > 0 ? (netVal / expectedNetWorth) : 0;
    
    let stanleyStatus, stanleyAdvice, stanleyColor;
    if (netVal >= expectedNetWorth * 2) {
      stanleyStatus = 'Prodigious Accumulator (PAW)';
      stanleyAdvice = '👑 Elite Tier. You convert income to wealth with maximum efficiency. Your path to financial sovereignty is accelerated.';
      stanleyColor = '#10b981'; 
    } else if (netVal >= expectedNetWorth) {
      stanleyStatus = 'Average Accumulator (AAW)';
      stanleyAdvice = '👍 Market Standard. Your wealth aligns with your age/income profile. Automate higher allocations to break into the Elite Tier.';
      stanleyColor = '#f59e0b'; 
    } else {
      stanleyStatus = 'Under Accumulator (UAW)';
      stanleyAdvice = '⚠️ High Burn Rate. Your net worth trails your potential. Prioritize asset building over lifestyle consumption immediately.';
      stanleyColor = '#f43f5e'; 
    }

    // --- 2. Fidelity Milestone ---
    const getFidelityMultiplier = (a) => (a <= 30 ? 1 : a <= 40 ? 3 : a <= 50 ? 6 : a <= 60 ? 8 : 10);
    const fidelityMultiplier = getFidelityMultiplier(userAge);
    const fidelityTarget = fidelityMultiplier * annualIncome;
    const progress = fidelityTarget > 0 ? (netVal / fidelityTarget) * 100 : 0;
    const variance = netVal - fidelityTarget;

    let fidelityStatus, fidelityAdvice, fidelityColor;
    if (netVal >= fidelityTarget) {
      fidelityStatus = 'On Track';
      fidelityColor = '#10b981';
      fidelityAdvice = `📈 Capital Surplus: ₹${variance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}. You are ahead of the global age-based benchmark.`;
    } else {
      fidelityStatus = 'Behind Target';
      fidelityColor = '#f43f5e';
      fidelityAdvice = `📉 Capital Gap: ₹${Math.abs(variance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}. You need to bridge this gap to meet standard retirement milestones.`;
    }

    // --- 3. Pure Savings Rate ---
    const pureSavings = monthlyInc - monthlyExp;
    const savingsRate = monthlyInc > 0 ? (pureSavings / monthlyInc) * 100 : 0;
    let savingsTier, savingsAdvice, savingsColor;

    if (savingsRate >= 40) {
      savingsTier = 'Hyper-Accelerator';
      savingsAdvice = '🚀 FIRE Path. You are effectively buying back your time. Focus on tax-optimized compounding.';
      savingsColor = '#10b981';
    } else if (savingsRate >= 20) {
      savingsTier = 'Healthy Accumulator';
      savingsAdvice = '📈 Strong Core. You have built a structural surplus. This secures a standard retirement timeline.';
      savingsColor = '#6366f1'; 
    } else if (savingsRate >= 10) {
      savingsTier = 'Baseline Saver';
      savingsAdvice = '📉 Modest Surplus. Wealth building will be linear. Aim to increase rate by 1% every quarter.';
      savingsColor = '#f59e0b';
    } else {
      savingsTier = 'Cash-Flow Vulnerable';
      savingsAdvice = '⚠️ Critical. Expenses are consuming your future wealth. Audit discretionary burn immediately.';
      savingsColor = '#f43f5e';
    }

    setReport({
      netWorth: netVal.toLocaleString('en-IN'),
      expectedNetWorth: expectedNetWorth.toLocaleString('en-IN'),
      wealthRatio: wealthRatio.toFixed(2),
      stanleyStatus, stanleyAdvice, stanleyColor,
      fidelityStatus, fidelityAdvice, fidelityColor, fidelityMultiplier,
      fidelityTarget: fidelityTarget.toLocaleString('en-IN'),
      progress: isFinite(progress) ? progress.toFixed(1) : "0",
      savingsRate: savingsRate.toFixed(1),
      savingsTier, savingsAdvice, savingsColor
    });
  };

  const calculateSIP = () => {
    const P = parseFloat(sipMonthly) || 0;
    const annualRate = parseFloat(sipRate) || 0;
    const years = parseFloat(sipYears) || 0;
    if (P <= 0 || annualRate <= 0 || years <= 0) {
      Alert.alert("Input Error", "Please enter valid data.");
      return;
    }
    const n = years * 12; 
    const i = (annualRate / 12) / 100; 
    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    setSipResult({
      invested: totalInvested.toLocaleString('en-IN'),
      gained: (futureValue - totalInvested).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      total: futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.tab, view === 'DIAGNOSTIC' && styles.activeTab]} onPress={() => setView('DIAGNOSTIC')}>
          <Text style={[styles.tabText, view === 'DIAGNOSTIC' && styles.activeTabText]}>Wealth Diagnostic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, view === 'SIP' && styles.activeTab]} onPress={() => setView('SIP')}>
          <Text style={[styles.tabText, view === 'SIP' && styles.activeTabText]}>SIP Forecast</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {view === 'DIAGNOSTIC' && (
          <>
            <Text style={styles.headerTitle}>Financial Health Check</Text>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Monthly Income & Obligations</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Take-Home Pay (₹)" keyboardType="numeric" value={income} onChangeText={setIncome} placeholderTextColor="#64748b" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Expenses (₹)" keyboardType="numeric" value={expenses} onChangeText={setExpenses} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Debt/EMI (₹)" keyboardType="numeric" value={debt} onChangeText={setDebt} placeholderTextColor="#64748b" />
                </View>
              </View>

              <TextInput style={styles.input} placeholder="Monthly SIP Portfolio (₹)" keyboardType="numeric" value={sip} onChangeText={setSip} placeholderTextColor="#64748b" />
              
              <Text style={[styles.sectionTitle, {marginTop: 8, marginBottom: 8}]}>Asset Valuation</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Equity/MF (₹)" keyboardType="numeric" value={equity} onChangeText={setEquity} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="FD / Cash (₹)" keyboardType="numeric" value={fixedDeposit} onChangeText={setFixedDeposit} placeholderTextColor="#64748b" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="NPS Fund (₹)" keyboardType="numeric" value={nps} onChangeText={setNps} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Provident Fund (₹)" keyboardType="numeric" value={pf} onChangeText={setPf} placeholderTextColor="#64748b" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="PPF Portfolio (₹)" keyboardType="numeric" value={ppf} onChangeText={setPpf} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Gold & Metals (₹)" keyboardType="numeric" value={gold} onChangeText={setGold} placeholderTextColor="#64748b" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Real Estate (₹)" keyboardType="numeric" value={realEstate} onChangeText={setRealEstate} placeholderTextColor="#64748b" />
                </View>
                <View style={styles.inputCol}>
                  <TextInput style={styles.input} placeholder="Other Assets (₹)" keyboardType="numeric" value={others} onChangeText={setOthers} placeholderTextColor="#64748b" />
                </View>
              </View>
            </View>

            <View style={styles.advancedCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.advancedLabel}>Include Liabilities</Text>
                <Switch value={showAdvanced} onValueChange={setShowAdvanced} trackColor={{ false: '#334155', true: '#ef4444' }} thumbColor="#f8fafc"/>
              </View>
              {showAdvanced && (
                <View style={[styles.inputRow, {marginTop: 12, marginBottom: 4}]}>
                  <View style={styles.inputCol}>
                    <TextInput style={[styles.input, styles.inputDanger]} placeholder="Credit Card (₹)" keyboardType="numeric" value={creditCardDebt} onChangeText={setCreditCardDebt} placeholderTextColor="#fca5a5" />
                  </View>
                  <View style={styles.inputCol}>
                    <TextInput style={[styles.input, styles.inputDanger]} placeholder="Unorganised (₹)" keyboardType="numeric" value={unorganisedDebt} onChangeText={setUnorganisedDebt} placeholderTextColor="#fca5a5" />
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={generateReport}>
              <Text style={styles.buttonText}>Generate Wealth Report</Text>
            </TouchableOpacity>
            
            {report && (
              <View style={styles.reportCard}>
                <Text style={styles.netWorthLabel}>Total Aggregate Net Worth</Text>
                <Text style={styles.netWorthValue}>₹{report.netWorth}</Text>
                
                <View style={styles.divider} />
                
                {/* Stanley Metric */}
                <Text style={styles.pillLabel}>STANLEY BENCHMARK</Text>
                <View style={[styles.statusBadge, { backgroundColor: report.stanleyColor + '15', borderColor: report.stanleyColor }]}>
                  <Text style={[styles.statusBadgeText, { color: report.stanleyColor }]}>{report.stanleyStatus}</Text>
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Baseline</Text>
                    <Text style={styles.gridValue}>₹{report.expectedNetWorth}</Text>
                  </View>
                  <View style={styles.vDivider} />
                  <View style={[styles.gridCol, {alignItems: 'flex-end'}]}>
                    <Text style={styles.gridLabel}>Ratio</Text>
                    <Text style={[styles.gridValue, {color: report.stanleyColor}]}>{report.wealthRatio}x</Text>
                  </View>
                </View>
                <Text style={styles.reportAdvice}>{report.stanleyAdvice}</Text>

                <View style={styles.divider} />

                {/* Fidelity Metric */}
                <Text style={styles.pillLabel}>FIDELITY MILESTONE</Text>
                <View style={styles.rowBetween}>
                  <View style={[styles.statusBadge, { backgroundColor: report.fidelityColor + '15', borderColor: report.fidelityColor, marginBottom: 0 }]}>
                    <Text style={[styles.statusBadgeText, { color: report.fidelityColor }]}>{report.fidelityStatus}</Text>
                  </View>
                  <Text style={styles.multiplierText}>{report.fidelityMultiplier}x Income Target</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressFill, { backgroundColor: report.fidelityColor, width: `${Math.min(parseFloat(report.progress), 100)}%` }]} />
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Target</Text>
                    <Text style={styles.gridValue}>₹{report.fidelityTarget}</Text>
                  </View>
                  <View style={styles.vDivider} />
                  <View style={[styles.gridCol, {alignItems: 'flex-end'}]}>
                    <Text style={styles.gridLabel}>Progress</Text>
                    <Text style={[styles.gridValue, {color: report.fidelityColor}]}>{report.progress}%</Text>
                  </View>
                </View>
                <Text style={styles.reportAdvice}>{report.fidelityAdvice}</Text>

                <View style={styles.divider} />

                {/* Savings Metric */}
                <Text style={styles.pillLabel}>CASH-FLOW EFFICIENCY</Text>
                <View style={[styles.statusBadge, { backgroundColor: report.savingsColor + '15', borderColor: report.savingsColor }]}>
                  <Text style={[styles.statusBadgeText, { color: report.savingsColor }]}>{report.savingsTier}</Text>
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Savings Rate</Text>
                    <Text style={[styles.gridValue, {color: report.savingsColor}]}>{report.savingsRate}%</Text>
                  </View>
                  <View style={styles.vDivider} />
                  <View style={[styles.gridCol, {alignItems: 'flex-end'}]}>
                    <Text style={styles.gridLabel}>Horizon</Text>
                    <Text style={styles.gridValue}>{parseFloat(report.savingsRate) >= 40 ? 'Accelerated' : 'Linear'}</Text>
                  </View>
                </View>
                <Text style={styles.reportAdvice}>{report.savingsAdvice}</Text>
              </View>
            )}
          </>
        )}

        {view === 'SIP' && (
          <>
            <Text style={styles.headerTitle}>Wealth Compounder</Text>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Input Parameters</Text>
              <TextInput style={styles.input} placeholder="Monthly Investment Amount (₹)" keyboardType="numeric" value={sipMonthly} onChangeText={setSipMonthly} placeholderTextColor="#64748b" />
              <TextInput style={styles.input} placeholder="Expected Return Rate (% p.a.)" keyboardType="numeric" value={sipRate} onChangeText={setSipRate} placeholderTextColor="#64748b" />
              <TextInput style={styles.input} placeholder="Investment Horizon (Years)" keyboardType="numeric" value={sipYears} onChangeText={setSipYears} placeholderTextColor="#64748b" />
              <TouchableOpacity style={[styles.primaryButton, {marginTop: 20}]} onPress={calculateSIP}>
                <Text style={styles.buttonText}>Calculate Projections</Text>
              </TouchableOpacity>
            </View>
            {sipResult && (
              <View style={styles.reportCard}>
                <Text style={styles.pillLabel}>TOTAL MATURITY VALUE</Text>
                <Text style={[styles.netWorthValue, {color: '#10b981'}]}>₹{sipResult.total}</Text>
                <View style={styles.divider} />
                <View style={styles.gridRow}>
                  <View style={styles.gridCol}>
                    <Text style={styles.gridLabel}>Principal</Text>
                    <Text style={styles.gridValue}>₹{sipResult.invested}</Text>
                  </View>
                  <View style={styles.vDivider} />
                  <View style={[styles.gridCol, {alignItems: 'flex-end'}]}>
                    <Text style={styles.gridLabel}>Est. Wealth Gain</Text>
                    <Text style={[styles.gridValue, {color: '#6366f1'}]}>₹{sipResult.gained}</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' }, 
  scroll: { padding: 16, paddingBottom: 30 }, 
  
  // Nav Bar
  navBar: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 4, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#1e293b' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#f8fafc' },
  
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#f8fafc', marginBottom: 14, letterSpacing: -0.5 },
  
  // Card Styling
  card: { backgroundColor: '#0f172a', padding: 14, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  sectionTitle: { color: '#6366f1', fontWeight: '700', marginBottom: 12, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  
  // Layout Multi-column grid rules
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  inputCol: { flex: 1, marginRight: 10 },
  
  // Inputs
  input: { borderBottomWidth: 1, borderBottomColor: '#1e293b', color: '#f8fafc', paddingVertical: 8, marginBottom: 12, fontSize: 14 },
  
  // Specific Red styles for Liabilities
  inputDanger: { borderBottomColor: '#ef4444', color: '#ef4444' }, 
  
  // Buttons
  primaryButton: { backgroundColor: '#6366f1', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  
  // Advanced Section
  advancedCard: { backgroundColor: '#0f172a', padding: 14, borderRadius: 16, marginBottom: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#334155' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  advancedLabel: { color: '#f8fafc', fontWeight: '600', fontSize: 14 },

  // Report Styles
  reportCard: { backgroundColor: '#0f172a', padding: 18, borderRadius: 20, marginTop: 10, borderWidth: 1, borderColor: '#6366f1' },
  netWorthLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', textAlign: 'center', marginBottom: 4 },
  netWorthValue: { color: '#f8fafc', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 14 },
  pillLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, alignSelf: 'flex-start', marginBottom: 12 },
  statusBadgeText: { fontWeight: '700', fontSize: 11, textTransform: 'uppercase' },
  
  // Grid Data Columns
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  gridCol: { flex: 1 },
  vDivider: { width: 1, height: '70%', backgroundColor: '#1e293b', marginHorizontal: 8 },
  gridLabel: { color: '#64748b', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  gridValue: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  reportAdvice: { color: '#94a3b8', fontSize: 12, lineHeight: 18, marginTop: 10, fontStyle: 'italic' },

  // Fidelity Specifics
  multiplierText: { color: '#6366f1', fontSize: 11, fontWeight: '700' },
  progressContainer: { height: 6, backgroundColor: '#1e293b', borderRadius: 10, width: '100%', marginVertical: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 10 }
});