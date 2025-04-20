import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Quote } from '../data/quotes';

type Props = {
  quote: Quote;
  onFavorite?: () => void;
};

const QuoteCard: React.FC<Props> = ({ quote, onFavorite }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{quote.text}</Text>
      {quote.author && <Text style={styles.author}>– {quote.author}</Text>}

      {onFavorite && (
        <TouchableOpacity style={styles.button} onPress={onFavorite}>
          <Text style={styles.buttonText}>Ajouter aux favoris</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    textAlign: 'right',
    color: '#555',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#2e86de',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default QuoteCard;
