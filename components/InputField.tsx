import {
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInputProps,
} from "react-native";

const InputField = ({
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  ...props
}: TextInputProps & {
  containerStyle?: string;
  inputStyle?: string;
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 grow">
          <View
            className={`p-2 flex flex-row justify-start items-center relative ${containerStyle}`}
          >
            <TextInput
              className={`text-brand-100 font-PrimaryText w-100 text-[16px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
