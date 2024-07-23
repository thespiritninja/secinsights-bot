interface IContextData {
  pageContent: string;
  metadata: {
    detection_class_prob: number;
    coordinates: {
      points: number[][];
      system: string;
      layout_width: number;
      layout_height: number;
    };
    last_modified: string;
    filetype: string;
    languages: string[];
    page_number: number;
    parent_id: string;
    file_directory: string;
    filename: string;
  };
}
interface IChatStruct {
  input: string;
  chat_history?: any[];
  context: IContextData[];
  answer: string;
}
