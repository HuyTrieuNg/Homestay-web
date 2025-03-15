import { useState } from "react";
import HomestayList from "@components/HomestayList";
import PropertyFilter from "@components/PropertyFilter";
import Header from "../components/Header";

function HomePage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);

  return (
    <>
      <Header onSelectAddress={setSelectedAddress} />
      <PropertyFilter onSelectPropertyType={setSelectedPropertyType} />
      <HomestayList
        province={selectedAddress}
        propertyTypeId={selectedPropertyType}
      />
    </>
  );
}

export default HomePage;
