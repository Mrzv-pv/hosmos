"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Zap,
  Car,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Leaf,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { INDUSTRIES, COUNTRIES, WIZARD_STEPS } from "@/lib/constants";
import { calculateEmissions, type EnergyData, type TransportData, type EmissionResult } from "@/lib/calculations";
import Link from "next/link";

const stepIcons = [Building2, Zap, Car, Users, CheckCircle];

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<EmissionResult | null>(null);

  // Step 1 — Company
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [headcount, setHeadcount] = useState("");

  // Step 2 — Energy
  const [electricity, setElectricity] = useState("");
  const [naturalGas, setNaturalGas] = useState("");
  const [diesel, setDiesel] = useState("");
  const [petrol, setPetrol] = useState("");
  const [lpg, setLpg] = useState("");

  // Step 3 — Transport
  const [fleetDieselKm, setFleetDieselKm] = useState("");
  const [fleetPetrolKm, setFleetPetrolKm] = useState("");
  const [fleetEvKm, setFleetEvKm] = useState("");
  const [shortFlights, setShortFlights] = useState("");
  const [longFlights, setLongFlights] = useState("");
  const [commuteCar, setCommuteCar] = useState("");

  // Step 4 — People
  const [totalEmployees, setTotalEmployees] = useState("");
  const [femaleEmployees, setFemaleEmployees] = useState("");
  const [accidents, setAccidents] = useState("");
  const [trainingHours, setTrainingHours] = useState("");

  const num = (v: string) => parseFloat(v) || 0;

  const handleCalculate = () => {
    const energy: EnergyData = {
      electricityKwh: num(electricity),
      electricityCountry: country,
      naturalGasM3: num(naturalGas),
      dieselLitres: num(diesel),
      petrolLitres: num(petrol),
      lpgLitres: num(lpg),
      otherFuelKg: 0,
    };

    const transport: TransportData = {
      fleetDieselKm: num(fleetDieselKm),
      fleetPetrolKm: num(fleetPetrolKm),
      fleetEvKm: num(fleetEvKm),
      shortHaulFlightsKm: num(shortFlights),
      mediumHaulFlightsKm: 0,
      longHaulFlightsKm: num(longFlights),
      commuteCarKm: num(commuteCar),
      commuteBusKm: 0,
      commuteTrainKm: 0,
      commuteRemoteEmployees: 0,
    };

    const emissions = calculateEmissions(energy, transport, num(headcount), country);
    setResult(emissions);
    setStep(5);
  };

  const nextStep = () => {
    if (step === 4) {
      handleCalculate();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(Math.max(1, step - 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-lg flex items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="font-serif text-xl">Hosmos</span>
        </Link>
        <span className="ml-auto text-sm text-gray-400">Step {step} of 5</span>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 mb-2">
          {WIZARD_STEPS.map((s, i) => {
            const Icon = stepIcons[i];
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                        isDone ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mb-8">
          {WIZARD_STEPS.map((s) => (
            <span
              key={s.id}
              className={`text-xs transition-colors ${
                s.id === step ? "text-blue-600 font-semibold" : "text-gray-400"
              }`}
              style={{ width: `${100 / WIZARD_STEPS.length}%`, textAlign: "center" }}
            >
              {s.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Card padding="lg">
                <h2 className="text-2xl font-serif text-gray-900 mb-2">Company Profile</h2>
                <p className="text-sm text-gray-500 mb-8">Tell us about your company to set up accurate calculations.</p>
                <div className="space-y-5">
                  <Input label="Company Name" placeholder="Acme Manufacturing d.o.o." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  <Select label="Industry" options={INDUSTRIES.map((i) => i)} value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  <Select label="Country" options={COUNTRIES.map((c) => c)} value={country} onChange={(e) => setCountry(e.target.value)} />
                  <Input label="Number of Employees" type="number" placeholder="50" value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card padding="lg">
                <h2 className="text-2xl font-serif text-gray-900 mb-2">Energy Consumption</h2>
                <p className="text-sm text-gray-500 mb-8">Annual energy data for Scope 1 and 2 calculation.</p>
                <div className="space-y-5">
                  <Input label="Electricity" type="number" placeholder="150000" unit="kWh/yr" value={electricity} onChange={(e) => setElectricity(e.target.value)} hint="Total annual electricity consumption" />
                  <Input label="Natural Gas" type="number" placeholder="5000" unit="m³/yr" value={naturalGas} onChange={(e) => setNaturalGas(e.target.value)} />
                  <Input label="Diesel (heating/generators)" type="number" placeholder="2000" unit="litres/yr" value={diesel} onChange={(e) => setDiesel(e.target.value)} />
                  <Input label="Petrol" type="number" placeholder="0" unit="litres/yr" value={petrol} onChange={(e) => setPetrol(e.target.value)} />
                  <Input label="LPG" type="number" placeholder="0" unit="litres/yr" value={lpg} onChange={(e) => setLpg(e.target.value)} />
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card padding="lg">
                <h2 className="text-2xl font-serif text-gray-900 mb-2">Transport & Travel</h2>
                <p className="text-sm text-gray-500 mb-8">Fleet mileage, business flights, and employee commuting.</p>
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-gray-700 pt-2">Company Fleet</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Diesel vehicles" type="number" placeholder="50000" unit="km/yr" value={fleetDieselKm} onChange={(e) => setFleetDieselKm(e.target.value)} />
                    <Input label="Petrol vehicles" type="number" placeholder="30000" unit="km/yr" value={fleetPetrolKm} onChange={(e) => setFleetPetrolKm(e.target.value)} />
                  </div>
                  <Input label="Electric vehicles" type="number" placeholder="10000" unit="km/yr" value={fleetEvKm} onChange={(e) => setFleetEvKm(e.target.value)} />
                  <h3 className="text-sm font-semibold text-gray-700 pt-4">Business Flights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Short-haul (&lt;1500km)" type="number" placeholder="5000" unit="km/yr" value={shortFlights} onChange={(e) => setShortFlights(e.target.value)} />
                    <Input label="Long-haul (&gt;3500km)" type="number" placeholder="2000" unit="km/yr" value={longFlights} onChange={(e) => setLongFlights(e.target.value)} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 pt-4">Employee Commute</h3>
                  <Input label="Total car commute" type="number" placeholder="100000" unit="km/yr" value={commuteCar} onChange={(e) => setCommuteCar(e.target.value)} hint="Aggregate annual car commuting by all employees" />
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card padding="lg">
                <h2 className="text-2xl font-serif text-gray-900 mb-2">People & Social</h2>
                <p className="text-sm text-gray-500 mb-8">Workforce data for social metrics and ESG scoring.</p>
                <div className="space-y-5">
                  <Input label="Total Employees" type="number" placeholder="120" value={totalEmployees} onChange={(e) => setTotalEmployees(e.target.value)} />
                  <Input label="Female Employees" type="number" placeholder="55" value={femaleEmployees} onChange={(e) => setFemaleEmployees(e.target.value)} />
                  <Input label="Workplace Accidents" type="number" placeholder="0" value={accidents} onChange={(e) => setAccidents(e.target.value)} hint="Number of reportable accidents in the last 12 months" />
                  <Input label="Training Hours per Employee" type="number" placeholder="24" unit="hrs/yr" value={trainingHours} onChange={(e) => setTrainingHours(e.target.value)} />
                </div>
              </Card>
            )}

            {step === 5 && result && (
              <div className="space-y-6">
                <Card padding="lg">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">Your Carbon Footprint</h2>
                    <p className="text-sm text-gray-500">Based on data for {companyName || "your company"}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-5 text-center">
                      <p className="text-xs text-gray-500 mb-1">Scope 1</p>
                      <p className="text-3xl font-serif text-blue-600">{result.scope1}</p>
                      <p className="text-xs text-gray-400 font-mono">tCO2e/year</p>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-5 text-center">
                      <p className="text-xs text-gray-500 mb-1">Scope 2</p>
                      <p className="text-3xl font-serif text-violet-600">{result.scope2}</p>
                      <p className="text-xs text-gray-400 font-mono">tCO2e/year</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-5 text-center">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-3xl font-serif text-gray-900">{result.total}</p>
                      <p className="text-xs text-gray-400 font-mono">tCO2e/year</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Scope 1 Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(result.scope1Breakdown)
                        .filter(([, v]) => v > 0)
                        .map(([key, val]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="font-mono text-gray-700">{val} t</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per employee</span>
                      <span className="font-mono text-gray-700">{result.perEmployee} tCO2e</span>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => alert("PDF export coming in production version!")}>
                    <Download size={16} className="mr-2" /> Download PDF Report
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full">
                      Go to Dashboard <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 5 && (
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={prevStep} disabled={step === 1}>
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <Button onClick={nextStep}>
              {step === 4 ? "Calculate" : "Continue"} <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
