import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Text} from "@/components/ui/text"

export function Check(props) {
    return <Text><FontAwesome name="check" {...props} /></Text>;
  }