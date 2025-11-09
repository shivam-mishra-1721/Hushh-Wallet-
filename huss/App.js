import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, FlatList, Alert } from 'react-native';

export default function BrandAffinityCard() {
  const [card, setCard] = useState({
    topBrands: [], // Array of {name, affinityScore}
    priceBands: { shirts: '' },
    wishlist: [], // Array of {sku, status: 'available' | 'out-of-stock' | 'discontinued'}
    membershipIDs: { store: '' },
    privacyLevel: 'Basic',
    wishlistVisibility: 'Nobody',
    showPriceBands: false,
    hideAllPrices: false, // Master toggle
  });

  const [newBrand, setNewBrand] = useState('');
  const [newWishlistItem, setNewWishlistItem] = useState('');
  const [metrics, setMetrics] = useState({ upsellRate: 0, irrelevantPitches: 0, wishlistConversion: 0 }); // Mock metrics

  // Simulate adding brand with affinity score
  const addBrand = () => {
    if (newBrand && card.topBrands.length < 10) {
      const newBrandObj = { name: newBrand, affinityScore: Math.random() * 10 }; // Simulated score
      setCard({ ...card, topBrands: [...card.topBrands, newBrandObj].sort((a, b) => b.affinityScore - a.affinityScore) });
      setNewBrand('');
    } else if (card.topBrands.length >= 10) {
      Alert.alert('Limit Reached', 'Only top 10 brands allowed.');
    }
  };

  const addWishlistItem = () => {
    if (newWishlistItem) {
      // Simulate edge cases: randomly assign status
      const statuses = ['available', 'out-of-stock', 'discontinued'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setCard({ ...card, wishlist: [...card.wishlist, { sku: newWishlistItem, status: randomStatus }] });
      setNewWishlistItem('');
    }
  };

  // Simulate claiming a wishlist item (for gift overlap)
  const claimItem = (index) => {
    const updatedWishlist = [...card.wishlist];
    updatedWishlist[index].status = 'claimed';
    setCard({ ...card, wishlist: updatedWishlist });
  };

  const renderSharedView = () => {
    let visibleData = { brands: card.topBrands.slice(0, 10).map(b => b.name) }; // Top 10
    if (card.privacyLevel === 'Standard' && card.showPriceBands && !card.hideAllPrices) {
      visibleData.priceBands = card.priceBands;
      visibleData.membershipIDs = card.membershipIDs.store.slice(-4); // Masked
    }
    if (card.privacyLevel === 'Detailed') {
      visibleData.membershipIDs = card.membershipIDs.store;
    }
    if (card.wishlistVisibility === 'Friends') {
      visibleData.wishlist = card.wishlist.map(item => {
        if (item.status === 'discontinued') return `Formerly loved ${item.sku}`;
        if (item.status === 'out-of-stock') return `Similar to ${item.sku}`;
        return item.sku;
      });
    }
    return (
      <View>
        <Text>Top Brands: {visibleData.brands.join(', ')}</Text>
        {visibleData.priceBands && <Text>Price Bands: {JSON.stringify(visibleData.priceBands)}</Text>}
        {visibleData.membershipIDs && <Text>Membership ID: {visibleData.membershipIDs}</Text>}
        {visibleData.wishlist && <Text>Wishlist: {visibleData.wishlist.join(', ')}</Text>}
      </View>
    );
  };

  // Simulate metrics update on share
  const simulateShare = () => {
    setMetrics({
      upsellRate: metrics.upsellRate + 35, // Mock increase
      irrelevantPitches: Math.max(0, metrics.irrelevantPitches - 50),
      wishlistConversion: metrics.wishlistConversion + 60,
    });
    Alert.alert('Shared!', 'Metrics updated.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Brand Affinity Card</Text>
      
      {/* Top Brands */}
      <TextInput placeholder="Add Brand" value={newBrand} onChangeText={setNewBrand} style={styles.input} />
      <Button title="Add Brand" onPress={addBrand} />
      <FlatList 
        data={card.topBrands} 
        renderItem={({ item }) => <Text>{item.name} (Score: {item.affinityScore.toFixed(1)})</Text>} 
        keyExtractor={(item, index) => index.toString()} 
      />

      {/* Price Bands with Master Toggle */}
      <TextInput placeholder="Price Band (e.g., Shirts: $50-150)" value={card.priceBands.shirts} onChangeText={(text) => setCard({ ...card, priceBands: { ...card.priceBands, shirts: text } })} style={styles.input} />
      <View style={styles.toggle}>
        <Text>Show Price Bands (Standard Level)</Text>
        <Switch value={card.showPriceBands} onValueChange={(value) => setCard({ ...card, showPriceBands: value })} />
      </View>
      <View style={styles.toggle}>
        <Text>Hide All Prices (Master Toggle)</Text>
        <Switch value={card.hideAllPrices} onValueChange={(value) => setCard({ ...card, hideAllPrices: value })} />
      </View>

      {/* Wishlist */}
      <TextInput placeholder="Add Wishlist Item (SKU)" value={newWishlistItem} onChangeText={setNewWishlistItem} style={styles.input} />
      <Button title="Add to Wishlist" onPress={addWishlistItem} />
      <Text>Wishlist Visibility: {card.wishlistVisibility}</Text>
      <Button title="Toggle Visibility" onPress={() => setCard({ ...card, wishlistVisibility: card.wishlistVisibility === 'Nobody' ? 'Friends' : 'Nobody' })} />
      <FlatList 
        data={card.wishlist} 
        renderItem={({ item, index }) => (
          <View>
            <Text>{item.sku} - {item.status}</Text>
            {item.status !== 'claimed' && <Button title="Claim for Gift" onPress={() => claimItem(index)} />}
          </View>
        )} 
        keyExtractor={(item, index) => index.toString()} 
      />

      {/* Membership IDs */}
      <TextInput placeholder="Membership ID" value={card.membershipIDs.store} onChangeText={(text) => setCard({ ...card, membershipIDs: { ...card.membershipIDs, store: text } })} style={styles.input} />

      {/* Privacy Level */}
      <Text>Privacy Level: {card.privacyLevel}</Text>
      <Button title="Upgrade to Standard" onPress={() => setCard({ ...card, privacyLevel: 'Standard' })} />
      <Button title="Upgrade to Detailed" onPress={() => setCard({ ...card, privacyLevel: 'Detailed' })} />

      {/* Shared View Preview */}
      <Text style={styles.subtitle}>Shared View Preview:</Text>
      {renderSharedView()}

      {/* Metrics Dashboard */}
      <Text style={styles.subtitle}>Success Metrics (Mock):</Text>
      <Text>Assisted Upsell Rate Increase: {metrics.upsellRate}%</Text>
      <Text>Irrelevant Brand Pitches Decrease: {metrics.irrelevantPitches}%</Text>
      <Text>Wishlist Conversion: {metrics.wishlistConversion}%</Text>

      <Button title="Save & Add to Wallet" onPress={() => Alert.alert('Card saved!')} />
      <Button title="Simulate Share" onPress={simulateShare} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  toggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
