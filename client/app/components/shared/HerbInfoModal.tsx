import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface HerbInfo {
  [key: string]: string | string[]
}

interface HerbInfoModalProps {
  visible: boolean
  onClose: () => void
  herbInfo: HerbInfo | null
  herbName: string
}

const HerbInfoModal: React.FC<HerbInfoModalProps> = ({
  visible,
  onClose,
  herbInfo,
  herbName,
}) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{herbName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name='close' size={24} color='#2f4f2d' />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {herbInfo ? (
              Object.entries(herbInfo).map(([key, value]) => (
                <View key={key} style={styles.infoSection}>
                  <Text style={styles.infoLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text style={styles.infoText}>
                    {Array.isArray(value) ? value.join(', ') : value}
                  </Text>
                </View>
              ))
            ) : (
              <ActivityIndicator size='large' color='#2f4f2d' />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 79, 45, 0.1)',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f4f2d',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    maxHeight: '90%',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f4f2d',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
})

export default HerbInfoModal
