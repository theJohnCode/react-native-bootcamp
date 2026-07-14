import { useListings } from '@/contexts/ListingsContext';
import { Brand, BRANDS, Condition, CONDITIONS, LaptopListing } from '@/data/laptop';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateLaptopScreen() {
  const { dispatch } = useListings();

  // Form state
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState<Brand>('Apple');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('Brand New');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('100');
  const [vendorName, setVendorName] = useState('');
  const [vendorLocation, setVendorLocation] = useState('');
  const [vendorRating, setVendorRating] = useState(5);

  const handleAddListing = () => {
    // Validate all fields
    if (!title || !price || !processor || !ram || !storage || !vendorName || !vendorLocation) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create the new laptop object
    const newLaptop: LaptopListing = {
      id: Date.now().toString(),
      title,
      brand,
      price: parseInt(price),
      condition,
      images: [`https://placehold.co/300x200?text=${title}`], // Placeholder image
      specs: {
        processor,
        ram,
        storage,
        batteryHealth: parseInt(batteryHealth),
      },
      vendor: {
        name: vendorName,
        location: vendorLocation,
        rating: vendorRating,
      },
    };

    // Dispatch ADD_LISTING action
    dispatch({ type: 'ADD_LISTING', payload: newLaptop });

    // Show success message
    Alert.alert('Success', 'Laptop listing created!');

    // Reset form
    setTitle('');
    setBrand('Apple');
    setPrice('');
    setCondition('Brand New');
    setProcessor('');
    setRam('');
    setStorage('');
    setBatteryHealth('100');
    setVendorName('');
    setVendorLocation('');
    setVendorRating(5);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Laptop Listing</Text>
        <Text style={styles.subtitle}>Fill in the details below to create a new listing</Text>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Laptop Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., MacBook Pro 13 M1"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Brand */}
        <View style={styles.section}>
          <Text style={styles.label}>Brand</Text>
          <View style={styles.picker}>
            <Picker selectedValue={brand} onValueChange={setBrand} mode='dropdown'>
              {/* fetch brands from laptop.ts file */}
              {BRANDS.map((b) => (
                <Picker.Item key={b} label={b} value={b} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>Price (₦)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500000"
            keyboardType="number-pad"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.label}>Condition</Text>
          <View style={styles.picker}>
            <Picker selectedValue={condition} onValueChange={setCondition} mode="dropdown">
              {CONDITIONS.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </View>


        {/* Processor */}
        <View style={styles.section}>
          <Text style={styles.label}>Processor</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Apple M1"
            value={processor}
            onChangeText={setProcessor}
          />
        </View>

        {/* RAM */}
        <View style={styles.section}>
          <Text style={styles.label}>RAM</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8GB"
            value={ram}
            onChangeText={setRam}
          />
        </View>

        {/* Storage */}
        <View style={styles.section}>
          <Text style={styles.label}>Storage</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 256GB SSD"
            value={storage}
            onChangeText={setStorage}
          />
        </View>

        {/* Battery Health */}
        <View style={styles.section}>
          <Text style={styles.label}>Battery Health (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100"
            keyboardType="number-pad"
            value={batteryHealth}
            onChangeText={setBatteryHealth}
          />
        </View>

        {/* Vendor Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., John Doe"
            value={vendorName}
            onChangeText={setVendorName}
          />
        </View>

        {/* Vendor Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Lagos"
            value={vendorLocation}
            onChangeText={setVendorLocation}
          />
        </View>

        {/* Vendor Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Rating</Text>
          <View style={styles.picker}>
            <Picker selectedValue={vendorRating} onValueChange={setVendorRating}>
              <Picker.Item label="1 Star" value={1} />
              <Picker.Item label="2 Stars" value={2} />
              <Picker.Item label="3 Stars" value={3} />
              <Picker.Item label="4 Stars" value={4} />
              <Picker.Item label="5 Stars" value={5} />
            </Picker>
          </View>
        </View>

        {/* Create Button */}
        <Pressable style={styles.createButton} onPress={handleAddListing}>
          <Text style={styles.createButtonText}>Create Listing</Text>
        </Pressable>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  createButton: {
    backgroundColor: '#1D9E75',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});
