"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Section,
  SectionHeading,
  Select,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { motion, AnimatePresence } from "framer-motion";
import { easeOut } from "@/components/motion";

const fleet = [
  {
    id: "TR-01",
    name: "Mini truck (1–3 t)",
    rate: "₹18/km",
    eta: "Same day",
    capacity: "3 tonnes",
    ratePerKm: 18,
  },
  {
    id: "TR-02",
    name: "Medium truck (5–8 t)",
    rate: "₹28/km",
    eta: "Next day",
    capacity: "8 tonnes",
    ratePerKm: 28,
  },
  {
    id: "TR-03",
    name: "Heavy truck (10–15 t)",
    rate: "₹42/km",
    eta: "1–2 days",
    capacity: "15 tonnes",
    ratePerKm: 42,
  },
  {
    id: "TR-04",
    name: "Tractor-trailer bulk",
    rate: "₹55/km",
    eta: "2–3 days",
    capacity: "25 tonnes",
    ratePerKm: 55,
  },
];

export default function TransportPage() {
  const [pickup, setPickup] = useState("Thanjavur");
  const [drop, setDrop] = useState("Coimbatore");
  const [load, setLoad] = useState("8");
  const [waste, setWaste] = useState("Rice Husk");
  const [selected, setSelected] = useState("TR-02");
  const [booked, setBooked] = useState(false);
  const [shipmentId, setShipmentId] = useState("");
  const [distance, setDistance] = useState(185);
  const [cost, setCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState([
    { label: "Booked", done: true },
    { label: "Pickup scheduled", done: true },
    { label: "In transit", done: false },
    { label: "Delivered", done: false },
  ]);

  const rate = fleet.find((v) => v.id === selected)?.ratePerKm ?? 28;
  const estimate = cost || distance * rate;

  async function book() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/transport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          drop,
          load: Number(load),
          wasteType: waste,
          vehicleId: selected,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setShipmentId(data.shipment.id);
      setDistance(data.shipment.distanceKm);
      setCost(data.shipment.cost);
      if (data.steps) setSteps(data.steps);
      setBooked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="Transportation booking"
          title="Move waste from field to buyer"
          subtitle="Transparent logistics for bulky organic waste — pick the right vehicle, see cost upfront, track every mile."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card hover={false}>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Package className="h-5 w-5 text-green" />
              Shipment details
            </h3>
            <div className="space-y-4">
              <Input
                label="Pickup location"
                id="pickup"
                value={pickup}
                onChange={setPickup}
                placeholder="Village / mandi"
              />
              <Input
                label="Drop location"
                id="drop"
                value={drop}
                onChange={setDrop}
                placeholder="Buyer facility"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Load (tonnes)"
                  id="load"
                  type="number"
                  value={load}
                  onChange={setLoad}
                />
                <Select
                  label="Waste type"
                  id="waste"
                  value={waste}
                  onChange={setWaste}
                  options={[
                    { value: "Rice Husk", label: "Rice Husk" },
                    { value: "Crop Residue", label: "Crop Residue" },
                    { value: "Banana Stems", label: "Banana Stems" },
                    { value: "Coconut Shells", label: "Coconut Shells" },
                    { value: "Sugarcane Waste", label: "Sugarcane Waste" },
                    { value: "Animal Manure", label: "Animal Manure" },
                  ]}
                />
              </div>
              <div className="rounded-lg bg-surface px-3 py-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green" />
                  Est. route: {pickup} → {drop}
                  {booked ? ` · ~${distance} km` : ""}
                </span>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Truck className="h-5 w-5 text-green" />
              Choose vehicle
            </h3>
            {fleet.map((v) => (
              <motion.button
                key={v.id}
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setSelected(v.id);
                  if (!booked) setCost(0);
                }}
                className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                  selected === v.id
                    ? "border-green bg-green-dim shadow-green/10"
                    : "border-border bg-card hover:border-green/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{v.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      Capacity {v.capacity} · {v.eta}
                    </p>
                  </div>
                  <Badge variant={selected === v.id ? "green" : "outline"}>
                    {v.rate}
                  </Badge>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <Card
          hover={false}
          className="mt-6 border-green/15 shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Estimated transport cost
              </p>
              <motion.p
                key={estimate}
                initial={{ opacity: 0.5, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 font-serif text-3xl text-foreground"
              >
                ₹{estimate.toLocaleString()}
              </motion.p>
              <p className="mt-1 text-sm text-muted">
                {booked ? `${distance} km · ` : ""}
                {load}t {waste} · includes base haulage
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {error && (
                <p className="text-sm text-red-600 sm:text-right">{error}</p>
              )}
              <Button
                className="sm:min-w-[180px]"
                onClick={book}
                disabled={loading || booked}
              >
                {booked
                  ? "Booking confirmed"
                  : loading
                    ? "Booking…"
                    : "Book transport"}
              </Button>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="mt-6"
            >
              <Card
                hover={false}
                className="border-green/30 shadow-[var(--shadow-lift)]"
              >
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <Badge variant="green">Active shipment</Badge>
                  <span className="text-sm text-muted">ID: {shipmentId}</span>
                </div>
                <div className="relative flex justify-between gap-2">
                  {steps.map((s, i) => (
                    <div
                      key={s.label}
                      className="relative z-10 flex flex-1 flex-col items-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: i * 0.08,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          s.done
                            ? "bg-green text-white shadow-md shadow-green/30"
                            : "border border-border bg-card text-muted"
                        }`}
                      >
                        {s.done ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </motion.div>
                      <p
                        className={`mt-2 text-xs font-medium ${
                          s.done ? "text-green" : "text-muted"
                        }`}
                      >
                        {s.label}
                      </p>
                      {i < steps.length - 1 && (
                        <div
                          className={`absolute left-[50%] top-4 h-0.5 w-full ${
                            s.done ? "bg-green/50" : "bg-border"
                          }`}
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-muted">
                  Driver will contact you 2 hours before pickup at {pickup}.
                  Saved to database.
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </PageShell>
  );
}
