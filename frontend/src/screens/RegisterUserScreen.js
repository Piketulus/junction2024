import React, { useState, useContext } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/registrationStyles'
import { REGISTER_USER } from '../graphql/mutations';
import { CORE_VALUES, RACES, SKILLS } from '../constants/constants';

const RegisterUserScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [registerUser] = useMutation(REGISTER_USER);

  const handleRegister = () => {
    const variables = {
      username: formData.username,
      password: formData.password,
      birthday: formData.birthDate,
      gender: formData.gender,
      race: formData.race,
      values: formData.coreValues,
      workingStyle: formData.workingStyle,
      workLifeBalance: formData.workLifeBalance,
      flexibility: formData.flexibility,
      mentalHealth: formData.mentalHealth,
      skills: formData.skills
    };

    registerUser({ variables })
      .then(response => {
        console.log(response)
        if (response.data.registerUser.success) {
          login('User', response.data.registerUser.user);
          navigation.replace('Home');
        } else {
          alert('Registration failed');
        }
      })
      .catch(err => alert(err));
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    birthDate: '',
    gender: '',
    race: '',
    coreValues: [],
    workingStyle: '',
    workLifeBalance: 5,
    flexibility: 5,
    mentalHealth: 5,
    skills: []
  });

  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCoreValueToggle = (value) => {
    const selected = formData.coreValues;
    if (selected.includes(value)) {
      setFormData({ ...formData, coreValues: selected.filter(val => val !== value) });
    } else if (selected.length < 3) {
      setFormData({ ...formData, coreValues: [...selected, value] });
    }
  };

  const handleSkillToggle = skill => {
    let updatedSkills;
    if (formData.skills.includes(skill)) {
      updatedSkills = formData.skills.filter(s => s !== skill);
    } else {
      updatedSkills = [...formData.skills, skill];
    }
  
    if (updatedSkills.length <= 8) {
      handleInputChange('skills', updatedSkills);
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => (prev > 1 ? prev - 1 : prev));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Create a Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Set Your Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Birth Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDateModal(true)}>
              <Text style={styles.inputText}>{formData.birthDate || 'Select Date'}</Text>
            </TouchableOpacity>
            <Modal transparent visible={showDateModal} animationType="slide" onRequestClose={() => setShowDateModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    maximumDate={new Date(2010, 11, 31)}
                    onChange={(event, selectedDate) => setTempDate(selectedDate || tempDate)}
                  />
                  <View style={styles.modalButtons}>
                    <Button title="Cancel" onPress={() => setShowDateModal(false)} />
                    <Button title="Confirm" onPress={() => { handleInputChange('birthDate', tempDate.toISOString().split('T')[0]); setShowDateModal(false); }} />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Select Gender</Text>
            {['Male', 'Female', 'Other'].map(option => (
              <TouchableOpacity key={option} style={[styles.option, formData.gender === option && styles.selectedOption]} onPress={() => handleInputChange('gender', option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Choose Race</Text>
            {RACES.map(option => (
              <TouchableOpacity key={option} style={[styles.option, formData.race === option && styles.selectedOption]} onPress={() => handleInputChange('race', option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Core Values (Choose up to 3)</Text>
            {CORE_VALUES.map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.option,
                  formData.coreValues.includes(value) && styles.selectedOption,
                  formData.coreValues.length >= 3 && !formData.coreValues.includes(value) && styles.disabledOption,
                ]}
                onPress={() => handleCoreValueToggle(value)}
                disabled={formData.coreValues.length >= 3 && !formData.coreValues.includes(value)}
              >
                <Text style={styles.optionText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.header}>Which working style best aligns with you?</Text>
            {['Collaborative', 'Independent'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  formData.workingStyle.includes(option) && styles.selectedOption,
                ]}
                onPress={() => handleInputChange('workingStyle', option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )  
        case 8:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.header}>Please answer the following questions from the scale of 1 to 10 on how important each one is to you</Text>
              <Text style={styles.subheader}>Work-life balance: {formData.workLifeBalance}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={formData.workLifeBalance}
                onValueChange={value => handleInputChange('workLifeBalance', value)}
              />

              <Text style={styles.subheader}>Flexible hours and working location: {formData.flexibility}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={formData.flexibility}
                onValueChange={value => handleInputChange('flexibility', value)}
              />

              <Text style={styles.subheader}>The priority of mental health in the workplace: {formData.mentalHealth}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={formData.mentalHealth}
                onValueChange={value => handleInputChange('mentalHealth', value)}
              />
            </View>
          );  
        case 9:
          return (
            <ScrollView>
              <Text style={styles.header}>Choose up to 8 skills that best represent your experience</Text>
              {SKILLS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    formData.skills.includes(option) && styles.selectedOption,
                    formData.skills.length >= 8 && !formData.skills.includes(option) && styles.disabledOption,
                  ]}
                  onPress={() => handleSkillToggle(option)}
                  disabled={formData.skills.length >= 8 && !formData.skills.includes(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
      default:
        return (
        <View style={styles.stepContainer}>
          <Text style={styles.header}>Review Your Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}><Text style={styles.label}>Username:</Text> {formData.username}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Date of Birth:</Text> {formData.birthDate}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Gender:</Text> {formData.gender}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Race:</Text> {formData.race}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Core Values:</Text> {formData.coreValues.join(', ')}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Working Style:</Text> {formData.workingStyle}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Importance of Work-life Balance:</Text> {formData.workLifeBalance}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Importance of Flexibility:</Text> {formData.flexibility}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Mental Health Prioritization:</Text> {formData.mentalHealth}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Skills:</Text> {formData.skills.join(', ')}</Text>
          </View>
        </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={prevStep}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, step < 10 ? styles.nextButton : styles.finishButton]}
          onPress={step < 10 ? nextStep : handleRegister}
        >
          <Text style={styles.buttonText}>{step < 10 ? 'Next' : 'Finish'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterUserScreen;
