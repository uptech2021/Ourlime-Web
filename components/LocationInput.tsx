// components/LocationInput.tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from '@reach/combobox';
import '@reach/combobox/styles.css';
import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

interface LocationInputProps {
    setLocation: (location: { lat: number; lng: number }) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ setLocation }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setLocation({ lat, lng });
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Enter a location"
            />
            <ComboboxPopover>
                {status === 'OK' && (
                    <ComboboxList>
                        {data.map((item: { place_id: string; description: string }) => (
                            <ComboboxOption key={item.place_id} value={item.description} />
                        ))}
                    </ComboboxList>
                )}
            </ComboboxPopover>
        </Combobox>
    );
};

export default LocationInput;