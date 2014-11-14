module z.m {
	export class Tag {
		public Id: Number;
		public Name: string;
		public Nested: string;
		public Child: Array<m.Tag>;
	}
}