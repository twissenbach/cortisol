import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useDispatch } from 'react-redux';
import { addTask as addTaskToFirebase } from '../firebaseServices';

export default function AddTaskModal({ visible, onClose }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddTask = () => {
    setShowConfirmation(true);
  };

  const handleConfirmTask = async () => {
    setIsLoading(true);
    try {
      // Add to Firebase
      const newTask = await addTaskToFirebase({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      // Update Redux store
      dispatch({
        type: 'ADD_TASK',
        payload: newTask
      });
      
      resetAndClose();
    } catch (error) {
      console.error('Error adding task:', error);
      // Keep the modal open if there's an error
      setShowConfirmation(false);
      Alert.alert(
        'Error',
        'Failed to add task. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setTaskTitle('');
    setTaskDescription('');
    setShowConfirmation(false);
    onClose();
  };

  const isValidTask = taskTitle.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task title *"
              placeholderTextColor="#666"
              value={taskTitle}
              onChangeText={setTaskTitle}
              maxLength={50}
            />
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              maxLength={200}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={resetAndClose}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.addButton,
                  !isValidTask && styles.addButtonDisabled
                ]}
                onPress={handleAddTask}
                disabled={!isValidTask || isLoading}
              >
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmation Modal */}
          <Modal
            visible={showConfirmation}
            transparent
            animationType="fade"
          >
            <View style={styles.confirmationContainer}>
              <BlurView intensity={20} style={StyleSheet.absoluteFill} />
              <View style={styles.confirmationContent}>
                <Text style={styles.confirmationTitle}>Confirm Task</Text>
                
                <View style={styles.taskPreview}>
                  <Text style={styles.previewLabel}>Title:</Text>
                  <Text style={styles.previewText}>{taskTitle}</Text>
                  
                  {taskDescription ? (
                    <>
                      <Text style={[styles.previewLabel, { marginTop: 10 }]}>
                        Description:
                      </Text>
                      <Text style={styles.previewText}>{taskDescription}</Text>
                    </>
                  ) : null}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => setShowConfirmation(false)}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Edit Task</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirmTask}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... keeping all your existing styles ...
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  addButtonDisabled: {
    backgroundColor: '#234966',
  },
  editButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmationContent: {
    width: '90%',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  taskPreview: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  previewText: {
    color: 'white',
    fontSize: 16,
  },
});