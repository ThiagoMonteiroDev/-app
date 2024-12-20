import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const API_URL = 'http://10.0.2.2:5000/products'; // Atualize conforme necessário para seu IP

// Tela de listagem de produtos
function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Buscar todos os produtos
    axios.get(API_URL)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar os produtos:', error);
      });
  }, []);

  const deleteProduct = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== id));
      })
      .catch(error => {
        console.error('Erro ao deletar o produto:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Produtos</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Quantidade: {item.quantity}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => navigation.navigate('Edit', { productId: item._id, productData: item })}>
                <Button title="Editar" />
              </TouchableOpacity>
              <Button title="Deletar" color="red" onPress={() => deleteProduct(item._id)} />
            </View>
          </View>
        )}
      />
      <Button title="Adicionar Produto" onPress={() => navigation.navigate('Add')} />
    </View>
  );
}

// Tela de cadastro de produto
function AddScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const addProduct = () => {
    const newProduct = { name, description, quantity, imageUrl };
    axios.post(API_URL, newProduct)
      .then(response => {
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Erro ao adicionar o produto:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da imagem"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Button title="Salvar Produto" onPress={addProduct} />
    </View>
  );
}

// Tela de edição de produto
function EditScreen({ route, navigation }) {
  const { productId, productData } = route.params;
  const [name, setName] = useState(productData.name);
  const [description, setDescription] = useState(productData.description);
  const [quantity, setQuantity] = useState(String(productData.quantity));
  const [imageUrl, setImageUrl] = useState(productData.imageUrl);

  const updateProduct = () => {
    const updatedProduct = { name, description, quantity, imageUrl };
    axios.put(`${API_URL}/${productId}`, updatedProduct)
      .then(response => {
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Erro ao editar o produto:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da imagem"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Button title="Salvar Alterações" onPress={updateProduct} />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  productItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
