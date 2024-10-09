class HandleError extends Error {
  public status: number;
  public message: string;

  constructor(message: string) {
    super(message);
  }
}

export default HandleError;
