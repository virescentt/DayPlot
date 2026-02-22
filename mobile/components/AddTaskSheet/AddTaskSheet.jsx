import React, { forwardRef, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import StepChooseType from './StepChooseType';
import StepFormPartOne from './StepFormPartOne';
import StepFormPartTwo from './StepFormPartTwo';

const AddTaskSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['85%'], []);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    type: null,
    title: '',
    start: '',
    end: '',
    description: '',
  });

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <View style={{ flex: 1, padding: 16 }}>
        {step === 0 && (
          // <StepChooseType
          //   onSelect={(type) => {
          //     setFormData((d) => ({ ...d, type }));
          //     next();
          //   }}
          // />
          <View>
            <Text>Privet</Text>
          </View>
        )}
        {/* {step === 1 && (
          <StepFormPartOne
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={prev}
          />
        )}
        {step === 2 && (
          <StepFormPartTwo
            formData={formData}
            setFormData={setFormData}
            onBack={prev}
            onSubmit={() => {
              console.log('Отправка данных', formData);
              ref.current?.close();
            }}
          />
        )} */}
      </View>
    </BottomSheet>
  );
});

export default AddTaskSheet;