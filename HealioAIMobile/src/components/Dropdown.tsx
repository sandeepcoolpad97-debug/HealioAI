import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onSelect: (value: string) => void;
  loading?: boolean;
  error?: string;
  required?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onSelect,
  loading = false,
  error,
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log('Dropdown props:', { label, placeholder, options, value, onSelect, loading, error, required });

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.selector, error ? styles.selectorError : null]}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <Text style={[styles.valueText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#6B7280" />
        ) : (
          <Icon name="chevron-down" size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      item.value === value && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        item.value === value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Icon name="checkmark" size={20} color="#0A5FB4" />
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectorError: {
    borderColor: '#EF4444',
  },
  valueText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContent: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#F0F9FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#0A5FB4',
    fontWeight: '500',
  },
});
