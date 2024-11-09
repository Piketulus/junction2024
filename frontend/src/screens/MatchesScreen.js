// src/screens/MatchesScreen.js

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_MATCHES } from '../graphql/queries';

const MatchesScreen = () => {
  const { loading, error, data } = useQuery(GET_MATCHES);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.match}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>User: {item.user.username}</Text>
          <Text>Company: {item.company.name}</Text>
          <Text>Match Score: {item.score}</Text>
        </View>
      )}
    />
  );
};

export default MatchesScreen;
