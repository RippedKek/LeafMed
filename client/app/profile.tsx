import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Remedy {
  name: string
  dosage: string
  recipe: string
  image: any
}

interface Disease {
  id: string
  name: string
  symptoms: string
  remedies: Remedy[]
}

const dummyPinnedDiseases: Disease[] = [
  {
    id: '1',
    name: 'Common Cold',
    symptoms: 'Sneezing, Runny nose, Sore throat',
    remedies: [
      {
        name: 'Ginger Tea',
        dosage: '2 cups daily',
        recipe: 'Boil ginger slices in water for 10 minutes and drink warm.',
        image: require('../assets/images/home/basil.webp'),
      },
      {
        name: 'Honey Lemon',
        dosage: '1 tbsp honey with lemon juice daily',
        recipe: 'Mix honey and lemon in warm water and drink.',
        image: require('../assets/images/home/neem.jpg'),
      },
    ],
  },
  {
    id: '2',
    name: 'Flu',
    symptoms: 'Fever, Cough, Body aches',
    remedies: [
      {
        name: 'Turmeric Milk',
        dosage: '1 glass daily',
        recipe: 'Mix turmeric powder in warm milk and drink before bed.',
        image: require('../assets/images/home/turmeric.webp'),
      },
    ],
  },
]

const ProfilePage = () => {
  const router = useRouter()
  const { signOut } = useAuth()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false)
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false)
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [username, setUsername] = useState<string>(
    user?.username || user?.firstName + ' ' + user?.lastName || ''
  )
  const [email, setEmail] = useState<string>(
    user?.emailAddresses[0]?.emailAddress || ''
  )

  const openDiseaseModal = (disease: Disease) => {
    setSelectedDisease(disease)
    setModalVisible(true)
  }

  const closeDiseaseModal = () => {
    setSelectedDisease(null)
    setModalVisible(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <ScrollView
      style={[
        styles.scrollView,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      contentContainerStyle={styles.container}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.backButton}
        >
          <Feather name='arrow-left' size={24} color='#2F4F2D' />
        </TouchableOpacity>
        <View style={styles.profileIconContainerCentered}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.profileIcon} />
          ) : (
            <View style={styles.defaultAvatarContainer}>
              <Text style={styles.defaultAvatarText}>
                {user?.firstName?.[0] || user?.username?.[0] || '?'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username</Text>
        {isEditingUsername ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize='none'
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setIsEditingUsername(false)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editRow}>
            <Text style={styles.value}>{username || 'No username set'}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingUsername(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.editRow}>
          <Text style={styles.value}>{email || 'No email set'}</Text>
        </View>
      </View>

      <View style={styles.pinnedContainer}>
        <Text style={styles.pinnedTitle}>Pinned Recipes</Text>
        <FlatList
          data={dummyPinnedDiseases}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pinnedList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.diseaseItem}
              onPress={() => openDiseaseModal(item)}
            >
              <Text style={styles.diseaseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.signOutButtonContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={closeDiseaseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedDisease && (
              <>
                <Text style={styles.modalTitle}>{selectedDisease.name}</Text>
                <Text style={styles.modalSubtitle}>Symptoms:</Text>
                <Text style={styles.modalText}>{selectedDisease.symptoms}</Text>
                <Text style={styles.modalSubtitle}>Suggested Remedies:</Text>
                {selectedDisease.remedies.map((remedy, index) => (
                  <View key={index} style={styles.remedyContainer}>
                    <Image source={remedy.image} style={styles.remedyImage} />
                    <View style={styles.remedyTextContainer}>
                      <Text style={styles.remedyName}>{remedy.name}</Text>
                      <Text style={styles.remedyDosage}>
                        Dosage: {remedy.dosage}
                      </Text>
                      <Text style={styles.remedyRecipe}>{remedy.recipe}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeDiseaseModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    zIndex: 10,
  },
  profileIconContainerCentered: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#DCECDC',
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DCECDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2F4F2D',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F4F2D',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#1B3B2D',
    flex: 1,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#2F4F2D',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    color: '#1B3B2D',
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: '#BFD9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#2F4F2D',
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#2F4F2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pinnedContainer: {
    marginTop: 10,
  },
  pinnedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  pinnedList: {
    paddingLeft: 10,
  },
  diseaseItem: {
    backgroundColor: '#DCECDC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
  },
  diseaseName: {
    color: '#2F4F2D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#2F4F2D',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  signOutButtonContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginTop: 10,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 16,
    color: '#1B3B2D',
  },
  remedyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  remedyImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  remedyTextContainer: {
    flex: 1,
  },
  remedyName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F4F2D',
  },
  remedyDosage: {
    fontSize: 14,
    color: '#1B3B2D',
  },
  remedyRecipe: {
    fontSize: 14,
    color: '#1B3B2D',
  },
  closeButton: {
    backgroundColor: '#2F4F2D',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default ProfilePage
