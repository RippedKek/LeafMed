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
  Switch,
} from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileProCard from './components/ProfileProCard'
import {
  useUserStore,
  PinnedRemedy,
  State,
  Action,
} from './hooks/useFirebaseSync'
import { useTheme } from './context/ThemeContext'

const lightTheme = {
  backgroundColor: '#FFFFFF',
  containerBackground: '#FFFFFF',
  textColor: '#2F4F2D',
  secondaryTextColor: '#1B3B2D',
  inputBorderColor: '#2F4F2D',
  inputTextColor: '#1B3B2D',
  pinnedBackground: '#DCECDC',
  signOutButtonBackground: '#2F4F2D',
  signOutButtonText: '#FFFFFF',
}

const darkTheme = {
  backgroundColor: '#000000',
  containerBackground: '#000000',
  textColor: '#BFD9C4',
  secondaryTextColor: '#DCECDC',
  inputBorderColor: '#BFD9C4',
  inputTextColor: '#DCECDC',
  pinnedBackground: '#2F4F2D',
  signOutButtonBackground: '#BFD9C4',
  signOutButtonText: '#2F4F2D',
}

const ProfilePage = () => {
  const router = useRouter()
  const { signOut } = useAuth()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const { theme, toggleTheme } = useTheme()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [selectedRemedy, setSelectedRemedy] = useState<PinnedRemedy | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const pinnedRemedies = useUserStore((state: State & Action) => state.pinnedRemedies)
  const removePinnedRemedy = useUserStore((state: State & Action) => state.removePinnedRemedy)

  const [username, setUsername] = useState(
    user?.username || user?.firstName + ' ' + user?.lastName || ''
  )
  const [email] = useState(user?.emailAddresses[0]?.emailAddress || '')

  const openRemedyModal = (remedy: PinnedRemedy) => {
    setSelectedRemedy(remedy)
    setModalVisible(true)
  }

  const closeRemedyModal = () => {
    setSelectedRemedy(null)
    setModalVisible(false)
  }

  const handleUnpin = async (remedy: PinnedRemedy) => {
    if (!user) {
      console.error('No user found')
      return
    }
    try {
      await removePinnedRemedy(user.id, remedy)
      closeRemedyModal()
    } catch (error) {
      console.error('Error unpinning remedy:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const currentTheme = theme === 'light' ? lightTheme : darkTheme

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: currentTheme.backgroundColor, paddingTop: insets.top, paddingBottom: insets.bottom + 130 }]}
      contentContainerStyle={[styles.container, { flexGrow: 1, backgroundColor: currentTheme.containerBackground }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <Feather name='arrow-left' size={24} color={currentTheme.textColor} />
        </TouchableOpacity>
        <View style={[styles.profileIconContainerCentered, { backgroundColor: currentTheme.pinnedBackground }]}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.profileIcon} />
          ) : (
            <View style={[styles.defaultAvatarContainer, { backgroundColor: currentTheme.pinnedBackground }]}>
              <Text style={[styles.defaultAvatarText, { color: currentTheme.textColor }]}>
                {user?.firstName?.[0] || user?.username?.[0] || '?'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: currentTheme.textColor }]}>Username</Text>
        {isEditingUsername ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.input, { borderColor: currentTheme.inputBorderColor, color: currentTheme.inputTextColor }]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize='none'
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditingUsername(false)}>
              <Text style={[styles.saveButtonText, { color: theme === 'dark' ? '#BFD9C4' : '#2F4F2D' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editRow}>
            <Text style={[styles.value, { color: currentTheme.secondaryTextColor }]}>{username || 'No username set'}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingUsername(true)}>
              <Text style={[styles.editButtonText, { color: currentTheme.textColor }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: currentTheme.textColor }]}>Email</Text>
        <View style={styles.editRow}>
          <Text style={[styles.value, { color: currentTheme.secondaryTextColor }]}>{email || 'No email set'}</Text>
        </View>
      </View>

      {/* Theme toggle switch */}
      <View style={styles.themeToggleContainer}>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? '#2F4F2D' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#BFD9C4' }}
        />
        <Text style={[styles.themeToggleLabel, { color: currentTheme.textColor }]}>
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>

      <View style={styles.pinnedContainer}>
        <Text style={[styles.pinnedTitle, { color: currentTheme.textColor }]}>Pinned Remedies</Text>
        {pinnedRemedies.length > 0 ? (
          <FlatList
            data={pinnedRemedies}
            keyExtractor={(item) => item.dateAdded}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinnedList}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.remedyItem, { backgroundColor: currentTheme.pinnedBackground }]} onPress={() => openRemedyModal(item)}>
                <Text style={[styles.remedyName, { color: currentTheme.textColor }]}>{item.disease}</Text>
                <Text style={[styles.remedyDate, { color: currentTheme.textColor, opacity: 0.7 }]}>{new Date(item.dateAdded).toLocaleDateString()}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={[styles.noRemediesText, { color: currentTheme.textColor }]}>No pinned remedies yet. Chat with AI to get recommendations!</Text>
        )}
        <View style={styles.profileProCardContainerWithMargin}>
          <ProfileProCard />
          <TouchableOpacity style={[styles.signOutButton, { backgroundColor: currentTheme.signOutButtonBackground }]} onPress={handleSignOut}>
            <Text style={[styles.signOutButtonText, { color: currentTheme.signOutButtonText }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType='slide' onRequestClose={closeRemedyModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedRemedy && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: currentTheme.textColor }]}>{selectedRemedy.disease}</Text>
                  <TouchableOpacity style={styles.unpinButton} onPress={() => handleUnpin(selectedRemedy)}>
                    <MaterialCommunityIcons name='pin-off' size={24} color='#ff6b6b' />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.modalSubtitle, { color: currentTheme.textColor }]}>Recommended Herbs:</Text>
                {selectedRemedy.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientContainer}>
                    <Text style={[styles.ingredientName, { color: currentTheme.textColor }]}>• {ingredient.name}</Text>
                    <Text style={[styles.ingredientUsage, { color: currentTheme.secondaryTextColor }]}>{ingredient.usage}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.closeButton} onPress={closeRemedyModal}>
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
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
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
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  editButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#2F4F2D', // default dark green for light mode
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeToggleLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  pinnedContainer: {
    marginTop: 10,
    paddingBottom: 40,
  },
  pinnedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  pinnedList: {
    paddingLeft: 10,
  },
  remedyItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 150,
  },
  remedyName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  remedyDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  noRemediesText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  unpinButton: {
    padding: 4,
  },
  ingredientContainer: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ingredientUsage: {
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 16,
  },
  closeButton: {
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileProCardContainer: {
    alignItems: 'center',
  },
  profileProCardContainerWithMargin: {
    alignItems: 'center',
    marginTop: 30,
  },
  signOutButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  signOutButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
})

export default ProfilePage

