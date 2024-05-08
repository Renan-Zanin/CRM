export function telephoneFormatter(tel: string) {
  return tel.toString().replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
}

export function removePhoneFormatter(telefoneFormatado: string): string {
  const phoneDigts = telefoneFormatado.replace(/\D/g, "");

  return phoneDigts;
}
