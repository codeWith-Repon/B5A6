1️⃣ Leaflet কী?

Leaflet হলো একটি জনপ্রিয় JavaScript map library
এটা দিয়ে আমরা—

- ম্যাপ দেখাতে পারি

- Marker, Popup, Polyline যোগ করতে পারি

- Zoom, Drag, Click ইত্যাদি handle করতে পারি

👉 Leaflet নিজে React না, এটা vanilla JS library।

2️⃣ React-Leaflet কী?

React-Leaflet হলো Leaflet-এর React wrapper।

মানে:

- Leaflet-এর কাজগুলো আমরা React Component আকারে ব্যবহার করতে পারি

- JSX ব্যবহার করে সহজে map বানানো যায়

উদাহরণ:

```bash
<MapContainer center={[23.8103, 90.4125]} zoom={13}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
</MapContainer>
```

🔹 এখানে:

- MapContainer → পুরো map

- TileLayer → map-এর design (OpenStreetMap)

3️⃣ leaflet-routing-machine কী?

এটা ব্যবহার করা হয় Route / Direction দেখানোর জন্য।

মানে:

- এক জায়গা থেকে আরেক জায়গায় যাওয়ার রাস্তা দেখানো

- Google Map-এর “Directions” এর মতো

এটা কী করে?

- Start point → End point নেয়

- মাঝখানের রাস্তা (route) দেখায়

- Distance ও Time হিসাব করে

4️⃣ কেন React-Leaflet + Routing Machine একসাথে?

কারণ:

- Map → React-Leaflet

- Route / Direction → leaflet-routing-machine

⚠️ Routing Machine সরাসরি React component না
তাই আমাদের custom component + useEffect ব্যবহার করতে হয়।

```bash
npm install leaflet react-leaflet leaflet-routing-machine
```

```bash
delete L.Icon.Default.prototype._getIconUrl;
```

👉 Leaflet মাঝে মাঝে বলে:

“আমি পিনের ছবি পাচ্ছি না 😭”

এই কোড বলে:

“এই নাও, পিনের ছবি এখানেই আছে”

👉 না দিলে ❌ Marker দেখাবে না

```bash
<TileLayer
  attribution='&copy; OpenStreetMap contributors'
  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
/>
```

1️⃣ TileLayer

👉 এটা বলে:

“আমি ম্যাপের ছবি দেখাবো”

যদি TileLayer না দাও ❌
👉 ম্যাপ থাকবে কিন্তু সাদা/খালি

2️⃣ url মানে কী?

```bash
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

এইটা আসলে ম্যাপের ছবি আনার ঠিকানা 🖼️

{z} {x} {y} কী?

ধরো ম্যাপটা একটা পাজল 🧩

{z} → zoom level (কত কাছে দেখছ)

{x} → ডানে-বামে কোন টুকরা

{y} → ওপরে-নিচে কোন টুকরা

Leaflet নিজে নিজে বলে:

“আমার এই zoom এ এই টুকরাগুলো দাও”

3️⃣ {s} মানে কী?

```bash
{s}.tile.openstreetmap.org
```
👉 {s} মানে:

a

b

c

এটা শুধু লোড ফাস্ট করার জন্য 🚀
একটা সার্ভারে চাপ না দিয়ে ৩টায় ভাগ করে