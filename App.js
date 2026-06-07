import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Switch,
} from 'react-native';

export default function App() {
  const [view, setView] = useState('DIAGNOSTIC');

  // --- Wealth Diagnostic States ---
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [debt, setDebt] = useState('');
  const [sip, setSip] = useState('');
  const [equity, setEquity] = useState('');
  const [gold, setGold] = useState('');
  const [realEstate, setRealEstate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creditCardDebt, setCreditCardDebt] = useState('');
  const [unorganisedDebt, setUnorganisedDebt] = useState('');
  const [report, setReport] = useState(null);

  // --- Budget Calculator States ---
  const [budgetInc, setBudgetInc] = useState('');
  const [budgetRes, setBudgetRes] = useState(null);

  const generateReport = () => {
    const userAge = parseInt(age) || 0;
    const monthlyInc = parseFloat(income) || 0;
    const annualIncome = monthlyInc * 12;
    const netVal = (parseFloat(equity) || 0) + (parseFloat(gold) || 0) + (parseFloat(realEstate) || 0) 
                     - (parseFloat(creditCardDebt) || 0) - (parseFloat(unorganisedDebt) || 0);

    const expectedNetWorth = (userAge * annualIncome) / 10;
    const stanleyStatus = netVal >= expectedNetWorth * 2 ? 'Prodigious Accumulator (PAW)' : 
                          netVal >= expectedNetWorth ? 'Average Accumulator (AAW)' : 'Under Accumulator (UAW)';

    const getFidelityTarget = (a) => (a <= 30 ? 1 : a <= 40 ? 3 : a <= 50 ? 6 : a <= 60 ? 8 : 10);
    const fidelityTarget = getFidelityTarget(userAge) * annualIncome;
    const fidelityStatus = netVal >= fidelityTarget ? 'On Track' : 'Behind Target';
    const progress = (netVal / fidelityTarget) * 100;

    setReport({
      netWorth: netVal.toLocaleString('en-IN'),
      expectedNetWorth: expectedNetWorth.toLocaleString('en-IN'),
      stanleyStatus,
      fidelityStatus,
      fidelityTarget: fidelityTarget.toLocaleString('en-IN'),
      progress: isFinite(progress) ? progress.toFixed(1) : "0"
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.tab, view === 'DIAGNOSTIC' && styles.activeTab]} onPress={() => setView('DIAGNOSTIC')}><Text style={styles.tabText}>Wealth Diag</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, view === 'BUDGET' && styles.activeTab]} onPress={() => setView('BUDGET')}><Text style={styles.tabText}>50/30/20 Budget</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {view === 'DIAGNOSTIC' ? (
          <>
            <Text style={styles.title}>Wealth Diagnostic</Text>
            <View style={styles.formCard}>
              <Text style={styles.sectionHeader}>Core Data</Text>
              <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
              <TextInput style={styles.input} placeholder="Monthly Income (₹)" keyboardType="numeric" value={income} onChangeText={setIncome} />
              <TextInput style={styles.input} placeholder="Monthly EMI (₹)" keyboardType="numeric" value={debt} onChangeText={setDebt} />
              <TextInput style={styles.input} placeholder="Monthly SIP (₹)" keyboardType="numeric" value={sip} onChangeText={setSip} />
              <Text style={styles.sectionHeader}>Assets (Current Value)</Text>
              <TextInput style={styles.input} placeholder="Equity (₹)" keyboardType="numeric" value={equity} onChangeText={setEquity} />
              <TextInput style={styles.input} placeholder="Gold (₹)" keyboardType="numeric" value={gold} onChangeText={setGold} />
              <TextInput style={styles.input} placeholder="Real Estate (₹)" keyboardType="numeric" value={realEstate} onChangeText={setRealEstate} />
            </View>

            <View style={styles.toggleCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{color: '#fff'}}>Advanced Parameters</Text>
                <Switch value={showAdvanced} onValueChange={setShowAdvanced} />
              </View>
              {showAdvanced && (
                <View style={{marginTop: 10}}>
                  <TextInput style={styles.alertInput} placeholder="Credit Card Debt (₹)" keyboardType="numeric" value={creditCardDebt} onChangeText={setCreditCardDebt} />
                  <TextInput style={styles.alertInput} placeholder="Unorganised Debt (₹)" keyboardType="numeric" value={unorganisedDebt} onChangeText={setUnorganisedDebt} />
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={generateReport}><Text style={styles.buttonText}>Run Assessment</Text></TouchableOpacity>
            
            {report && (
              <View style={styles.reportCard}>
                <Text style={styles.reportScore}>Net Worth: ₹{report.netWorth}</Text>
                <View style={styles.divider} />
                <Text style={styles.reportText}><Text style={styles.bold}>Stanley Status:</Text> {report.stanleyStatus}</Text>
                <Text style={styles.subText}>Expected Assets (Baseline): ₹{report.expectedNetWorth}</Text>
                <View style={styles.divider} />
                <Text style={styles.reportText}><Text style={styles.bold}>Fidelity Milestone:</Text> {report.fidelityStatus}</Text>
                <Text style={styles.subText}>Target: ₹{report.fidelityTarget} | Progress: {report.progress}%</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.title}>50/30/20 Budget Planner</Text>
            <View style={styles.formCard}>
              <TextInput style={styles.input} placeholder="Monthly Income (₹)" keyboardType="numeric" value={budgetInc} onChangeText={setBudgetInc} />
              <TouchableOpacity style={styles.button} onPress={() => setBudgetRes({ needs: (budgetInc * 0.5).toLocaleString('en-IN'), wants: (budgetInc * 0.3).toLocaleString('en-IN'), savings: (budgetInc * 0.2).toLocaleString('en-IN') })}><Text style={styles.buttonText}>Calculate</Text></TouchableOpacity>
            </View>
            {budgetRes && (
              <View style={styles.reportCard}>
                <Text style={styles.reportText}>Needs (50%): ₹{budgetRes.needs}</Text>
                <Text style={styles.reportText}>Wants (30%): ₹{budgetRes.wants}</Text>
                <Text style={styles.reportText}>Savings/Debt (20%): ₹{budgetRes.savings}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  navBar: { flexDirection: 'row', backgroundColor: '#1e293b', paddingHorizontal: 10 },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#38bdf8' },
  tabText: { color: '#fff', fontWeight: 'bold' },
  scroll: { padding: 20 },
  title: { fontSize: 22, color: '#fef08a', textAlign: 'center', marginBottom: 20 },
  formCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionHeader: { fontSize: 14, color: '#38bdf8', marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: '#334155', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  alertInput: { backgroundColor: '#451a03', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderColor: '#991b1b', borderWidth: 1 },
  toggleCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#38bdf8', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { fontWeight: 'bold' },
  reportCard: { backgroundColor: '#1e293b', padding: 20, borderRadius: 10, marginTop: 10 },
  reportScore: { fontSize: 20, color: '#fef08a', fontWeight: 'bold' },
  reportText: { color: '#fff', fontSize: 14, marginBottom: 5 },
  subText: { color: '#94a3b8', fontSize: 12 },
  bold: { fontWeight: 'bold', color: '#38bdf8' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 }
});